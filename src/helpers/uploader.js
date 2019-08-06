import axios from 'axios';

const config = {
  imaginary_api: 'https://imaginary.tst.protocol.one',
};

export function OpenFileDialog(accept, select) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.style.display = 'none';
  document.body.appendChild(input);
  input.addEventListener('change', () => (async () => {
    if (!input.files.length) {
      return;
    }
    select(input.files[0]);
  })());
  input.click();
  // ... no promise cuz at this point we didn't known when dialog is closed.
}

export function UploadImage(file, opts, fileReady) {
  const formData = new FormData();
  formData.append('file', file, file.name);
  axios
    .post(`${config.imaginary_api}/resize`, formData, {
      params: {
        width: opts.width,
        height: opts.height,
        format: 'jpeg',
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => fileReady([res.data]));
}
