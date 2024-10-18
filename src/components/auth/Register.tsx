'use client'

import { onThirdPartyLogin } from '../../utils/superTokenUtilities'
import { usePlatform } from '../../hooks/usePlatform'
import { Link } from 'react-router-dom'
import { AUTH_MODE } from '../../utils/config'
import { AuthLayout } from './AuthLayout'
import { RegisterForm } from './forms/RegisterForm'
import TextDivider from './TextDivider'
import { LoginComponent } from './Login'
import { IonIcon } from '@ionic/react'
import { logoApple, logoGoogle } from 'ionicons/icons'

const ThirdPartyEmailPasswordRegister = () => {
  const platform = usePlatform()
  return (
    <>
      <AuthLayout>
        <div className="flex flex-col">
          <p className="mt-2 text-sm text-gray-700">
            <Link
              to="/"
              className="font-medium text-[--ion-color-primary] hover:underline"
            >
              Go back to home{' '}
            </Link>{' '}
          </p>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Get started for free
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </Link>{' '}
              to your account.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div>
            <div>
              <p className="text-sm font-medium text-gray-700">Register with</p>
              <div className="flex flex-col mt-2 space-y-6">
                <button
                  onClick={() =>
                    onThirdPartyLogin({
                      provider: 'google',
                      platform,
                    })
                  }
                >
                  <IonIcon icon={logoGoogle} />
                </button>
                <button
                  onClick={() =>
                    onThirdPartyLogin({
                      provider: 'apple',
                      platform,
                    })
                  }
                >
                  <IonIcon icon={logoApple} />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <TextDivider text="Or register with" />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <RegisterForm />
        </div>
      </AuthLayout>
    </>
  )
}

const EmailPasswordRegister = () => (
  <>
    <AuthLayout>
      <div className="flex flex-col">
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Get started for free
          </h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
            Already registered?{' '}
            <Link
  to="/auth/login"
              className="font-medium text-[--ion-color-primary] hover:underline"
            >
              Sign in
            </Link>{' '}
            to your account.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </AuthLayout>
  </>
)

export const RegisterComponent = () => {
  if (AUTH_MODE === 'emailpassword') {
    return <EmailPasswordRegister />
  }

  // These do not need a separate register flow
  if (
    AUTH_MODE === 'thirdparty' ||
    AUTH_MODE === 'passwordless' ||
    AUTH_MODE === 'thirdpartypasswordless'
  ) {
    return <LoginComponent />
  }

  return <ThirdPartyEmailPasswordRegister />
}
