import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import {
  signupWithEmailPassword,
  signinWithEmailPassword,
} from '../../../utils/superTokenUtilities'
import InputField from './InputField'
import { Button } from './Button'
// import { getPreviousPath } from 'lib/next-apps/shared/storage'
// import { authPages } from 'lib/next-apps/platform/config'
// import { SavePassword } from 'capacitor-ios-autofill-save-password'

export type LoginFormVariables = {
  email: string
  password: string
}

export const RegisterForm = ({ redirectUri }: { redirectUri?: string }) => {
  const history = useHistory()

  //   const refreshUser = useRefreshUser()

  const registerType = 'emailpassword'
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormVariables>({
    mode: 'onBlur',
  })

  const onSubmit = async ({ email, password }: LoginFormVariables) => {
    const emailLowerCase = email.toLocaleLowerCase().trim()
    // const previousPath = await getPreviousPath()

    // console.log({ pref: previousPath })
    const superTokensResponse = await signupWithEmailPassword({
      email: emailLowerCase,
      password,
    })

    if (superTokensResponse.status !== 'OK') {
      throw new Error('Error creating ST account')
    }

    console.log({ superTokensResponse }, 'valid')

    if (!superTokensResponse || superTokensResponse.status !== 'OK') {
      setError('password', {
        message: 'Gebruikersnaam of wachtwoord is incorrect',
      })
      setError('email', {
        message: 'Gebruikersnaam of wachtwoord is incorrect',
      })

      return
    }

    if (
      registerType === 'emailpassword' &&
      !!password &&
      superTokensResponse.status === 'OK'
    ) {
      await signinWithEmailPassword({
        email: emailLowerCase,
        password,
      })
    }

    // await refreshUser()

    if (redirectUri) {
      history.push(redirectUri)
      return
    }

    // if you want to redirect to the previous page after login, comment this out and make sure to add the previouspath:
    // if (
    //   previousPath &&
    //   previousPath !== 'null' &&
    //   ![...authPages, '/'].includes(previousPath)
    // ) {
    //   router.push(previousPath)
    //   return
    // }

    // if (nativeOS === 'ios' && password) {
    //   await SavePassword.promptDialog({
    //     username: emailLowerCase,
    //     password: password,
    //   })
    // }
    history.push('/login-result')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col space-y-6">
        <InputField
          id="email"
          type="text"
          htmlForLabel="email"
          autoComplete="email"
          error={errors?.email?.message}
          label="Email"
          required
          className="px-4 py-3 rounded-full text-sm font-medium text-gray-900 placeholder-gray-500 border border-gray-300 shadow-sm focus:outline-none focus:ring-[--ion-color-primary-tint] focus:border-[--ion-color-primary-tint] focus:z-10 sm:text-sm dark:border-transparent dark:text-gray-200"
          name="email"
          register={register('email')}
        />
        <InputField
          id="password"
          type="password"
          htmlForLabel="password"
          error={errors?.password?.message}
          label="Password"
          autoComplete="current-password"
          name="password"
          className="px-4 py-3 rounded-full text-sm font-medium text-gray-900 placeholder-gray-500 border border-gray-300 shadow-sm focus:outline-none focus:ring-[--ion-color-primary-tint] focus:border-[--ion-color-primary-tint] focus:z-10 bg-gray sm:text-sm dark:border-transparent dark:text-gray-200"
          required
          register={register('password')}
        />
          {/* <Link href="/forgot-password">
            <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </Link> */}
      </div>

      <div className="mt-6">
        <Button type="submit" loading={isSubmitting} className="text-white bg-[--ion-color-primary] hover:bg-[--ion-color-primary-shade] focus:ring-4 focus:ring-[--ion-color-primary-tint] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">
          Register
        </Button>
      </div>
    </form>
  )
}
