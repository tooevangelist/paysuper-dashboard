function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.info(`Fallback: Copying text command was ${msg}`);
  } catch (err) {
    console.warn('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
export default function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    console.info('Async: Copying to clipboard was successful!');
  }, (err) => {
    console.warn('Async: Could not copy text: ', err);
  });
}
