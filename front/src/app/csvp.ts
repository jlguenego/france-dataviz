interface PromiseHelper {
  resolve?(str: string): void;
  reject?(): void;
}

const promiseHelper = {} as PromiseHelper;

const script = document.createElement('script');
document.head.appendChild(script);

export function csvp(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('csvp start');
    promiseHelper.resolve = resolve;
    promiseHelper.reject = reject;
    script.src = url;
  });
}

(window as any).csvp = function (str: string) {
  console.log('window.csvp start', str);
  // TODO : check str is csv format.
  if (!isCsvFormat(str)) {
    return promiseHelper.reject();
  }
  promiseHelper.resolve(str);
};

function isCsvFormat(str: string) {
  const array = str
    .split(/[\r\n]/)
    .filter((row) => row.match(/^[^#@]/) && row !== '');
  const header = array.shift();
  const length = header.split(',').length;
  const isSameLength = array.reduce(
    (acc, n) => acc && n.split(',').length === length,
    true
  );
  return isSameLength;
}
