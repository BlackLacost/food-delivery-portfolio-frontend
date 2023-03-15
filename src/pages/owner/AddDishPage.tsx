import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { FormError } from '../../components/FormError'
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

  const onSubmit: SubmitHandler<AddDishForm> = async ({
    name,
    description,
    price,
    options,
    image,
  }) => {
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

  const onAddOptionClick = () => prepend({ name: '' })

  return (
    <div className="container flex flex-col items-center">
      <Helmet>
        <title>Добавить Блюдо | Доставка Еды</title>
      </Helmet>
      <h1 className="mb-8 mt-28 text-2xl">Добавить блюдо</h1>
      <form
        className="mx-auto my-5 grid w-full max-w-screen-sm gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          registerProps={register('name')}
          placeholder="Название"
          error={errors.name}
        />
        <Input
          registerProps={register('description')}
          placeholder="Описание"
          error={errors.description}
        />
        <input
          className="hidden"
          {...register('image')}
          accept="image/*"
          type="file"
          id="coverImage"
        />
        <label
          htmlFor="coverImage"
          className="input cursor-pointer text-gray-400"
        >
          {watch('image') && watch('image').length > 0
            ? watch('image')[0].name
            : 'Выберете картинку'}
        </label>
        {errors.image?.message && (
          <FormError>{errors.image.message.toString()}</FormError>
        )}
        <Input
          registerProps={register('price')}
          type="number"
          min={0}
          error={errors.price}
          placeholder="Рублей"
        />
        <div className="my-10">
          <p className="mb-5 text-lg">Доп. опции</p>
          <button
            className="mb-5 bg-gray-900 px-4 py-2 font-semibold text-white"
            onClick={onAddOptionClick}
            type="button"
          >
            Добавить опцию
          </button>
          <div className="grid gap-3">
            {fields.map((field, index) => (
              <Fragment key={field.id}>
                <div>{JSON.stringify(console.log({ errors }))}</div>
                <section className="flex space-x-3" key={field.id}>
                  <Input
                    className="py-2"
                    registerProps={register(`options.${index}.name`)}
                    placeholder="Название"
                  />
                  <Input
                    className="py-2"
                    registerProps={register(`options.${index}.extra`)}
                    type="number"
                    min={0}
                    placeholder="Цена"
                  />
                  <button
                    className="bg-red-500 px-4 py-1 font-semibold text-white"
                    onClick={() => remove(index)}
                    type="button"
                  >
                    Удалить опцию
                  </button>
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
