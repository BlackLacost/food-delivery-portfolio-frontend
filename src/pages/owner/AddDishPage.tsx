import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { AddDishForm, addDishSchema } from '../../form.schemas'
import { graphql } from '../../gql'
import { CreateDishDocument, MyRestaurantDocument } from '../../gql/graphql'
import { uploadImage } from '../utils/upload-image'

graphql(`
  mutation CreateDish($input: CreateDishInput!) {
    createDish(input: $input) {
      error {
        ... on Error {
          message
        }
      }
    }
  }
`)

export const AddDishPage = () => {
  const params = useParams<{ id: string }>()
  const [uploading, setUploading] = useState(false)
  const restaurantId = Number(params.id)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<AddDishForm>({
    defaultValues: {
      price: 0,
    },
    resolver: yupResolver(addDishSchema),
  })
  const { fields, remove, prepend } = useFieldArray({
    control,
    name: 'options',
  })

  const [addDish, { loading }] = useMutation(CreateDishDocument, {
    onCompleted: ({ createDish: { error } }) => {
      if (!error) {
        navigate(-1)
      }
    },
    refetchQueries: [
      {
        query: MyRestaurantDocument,
        variables: { input: { id: restaurantId } },
      },
    ],
  })

  const onSubmit = handleSubmit(
    async ({ name, description, price, options, image }) => {
      // console.log(rest)
      try {
        setUploading(true)
        const photo = await uploadImage(image[0])
        setUploading(false)

        addDish({
          variables: {
            input: { name, description, price, restaurantId, options, photo },
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
  )

  const onAddOptionClick = () => prepend({ name: '' })

  return (
    <div className="container flex flex-col items-center">
      <Helmet>
        <title>Добавить Блюдо | Доставка Еды</title>
      </Helmet>
      <h1 className="mb-8 mt-28 text-2xl">Добавить блюдо</h1>
      <form
        className="mx-auto my-5 grid w-full max-w-screen-sm gap-3"
        onSubmit={onSubmit}
      >
        <Input
          {...register('name')}
          placeholder="Название"
          error={errors.name}
        />
        <Input
          {...register('description')}
          placeholder="Описание"
          error={errors.description}
        />
        <Input
          className="hidden"
          {...register('image')}
          accept="image/*"
          type="file"
          id="coverImage"
        >
          {watch('image') && watch('image').length > 0
            ? watch('image')[0].name
            : 'Выберете картинку'}
        </Input>
        <Input
          {...register('price', { min: 0 })}
          type="number"
          error={errors.price}
          placeholder="Рублей"
        />
        <div className="my-10">
          <p className="mb-5 text-lg">Доп. опции</p>
          <Button
            color="secondary"
            size="small"
            onClick={onAddOptionClick}
            type="button"
          >
            Добавить опцию
          </Button>
          <div className="grid gap-3">
            {fields.map((field, index) => (
              <Fragment key={field.id}>
                <div>{JSON.stringify(console.log({ errors }))}</div>
                <section className="flex space-x-3" key={field.id}>
                  <Input
                    {...register(`options.${index}.name`)}
                    placeholder="Название"
                    size="small"
                  />
                  <Input
                    {...register(`options.${index}.extra`, { min: 0 })}
                    type="number"
                    size="small"
                    placeholder="Цена"
                  />
                  <Button
                    color="warning"
                    size="small"
                    onClick={() => remove(index)}
                    type="button"
                  >
                    Удалить опцию
                  </Button>
                </section>
              </Fragment>
            ))}
          </div>
        </div>
        <Button loading={loading}>Добавить блюдо</Button>
      </form>
    </div>
  )
}
