import { getBotResult } from '@egghead/egghead-courses';

getBotResult().then((result) => {
  if (result !== undefined) {
    console.log(JSON.stringify(result));
  }
});
