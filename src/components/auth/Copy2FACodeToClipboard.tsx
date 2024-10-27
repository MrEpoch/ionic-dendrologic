import React from 'react'
import { Button } from '../ui/button'
import { Clipboard } from '@capacitor/clipboard';

export default function Copy2FACodeToClipboard({ code }: { code: string }) {

  const writeToClipboard = async () => {
    await Clipboard.write({
      string: code
    });
  };

  return (
    <Button onClick={writeToClipboard}>
      Copy 2FA code to clipboard
    </Button>
  )
}
