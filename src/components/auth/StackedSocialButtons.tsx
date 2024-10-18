import { onThirdPartyLogin } from '../../utils/superTokenUtilities'
import { logoGithub, logoGoogle, logoApple } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'

export const StackedSocialButtons = ({
  platform,
  buttons,
}: {
  platform: 'APP' | 'WEB'
  buttons: ('google' | 'github' | 'apple')[]
}) => (
  <div className="flex flex-col mt-2 space-y-6">
    {buttons.includes('google') && (
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
    )}
    {buttons.includes('github') && (
      <button
        onClick={() =>
          onThirdPartyLogin({
            provider: 'github',
            platform,
          })
        }
      >
        <IonIcon icon={logoGithub} />
      </button>
    )}
    {buttons.includes('apple') && (
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
    )}
  </div>
)
