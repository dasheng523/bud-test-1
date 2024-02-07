import { spawn } from "child_process";
import {JSONPath} from 'jsonpath-plus';

export const test = async () => {
  const result = await getAlibabaHtml('https://detail.1688.com/offer/724484714241.html');
  // const $ = cheerio.load(result);
  // const text = $('.title-text').text();
  // const imgs = $('.preview-img').attr('src');
  const resultJSON = JSON.parse(result);
  const title = JSONPath({path: '$..data.title', json: resultJSON});
  const imgs = JSONPath({path: '$..data.offerImgList', json: resultJSON});
  const video = JSONPath({path: '$..video.videoUrl', json: resultJSON});
  const price = JSONPath({path: '$..priceModel.currentPrices', json: resultJSON});
  const skus = JSONPath({path: '$..skuModel.skuProps', json: resultJSON});
  const parseResult = {title, imgs, video, price, skus};
  return parseResult
};

function getAlibabaHtml(url:string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["wdio.mjs", url], { cwd: __dirname });
    let result = "";
    let gettingResult = false;
    child.stdout.on("data", (data) => {
      if (data.toString().includes("wdio-result-start>>>")) {
        gettingResult = true;
      }
      if (gettingResult) {
        result += data.toString();
      }
      if (data.toString().includes("<<<wdio-result-end")) {
        gettingResult = false;
      }
    });

    let error = "";
    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    child.on("close", (code) => {
      console.log(`子进程退出码: ${code}`);
      if (code === 0) {
        resolve(result.replace("wdio-result-start>>>", "").replace("<<<wdio-result-end", ""));
      } else {
        reject(error);
      }
    });
  });
}
