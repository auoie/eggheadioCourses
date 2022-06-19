import { getBotResult } from '.';

getBotResult().then((result) => {
  if (result !== undefined) {
    console.log(JSON.stringify(result));
  }
});
