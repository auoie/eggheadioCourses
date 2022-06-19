import { getBotResult } from './bot';

getBotResult().then((result) => {
  if (result !== undefined) {
    console.log(JSON.stringify(result));
  }
});
