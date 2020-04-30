interface CSVPObject {
  resolve?(str: string): void;
  reject?(): void;
  script?: HTMLScriptElement;
}

const csvpObject = {} as CSVPObject;

export function csvp(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    csvpObject.resolve = resolve;
    csvpObject.reject = reject;
    csvpObject.script = document.createElement('script');
    csvpObject.script.src = url;
    document.head.appendChild(csvpObject.script);
  });
}

(window as any).csvp = function (str: string) {
  document.head.removeChild(csvpObject.script);
  csvpObject.script = undefined;
  // TODO : check str is csv format.
  if (!isCsvFormat(str)) {
    return csvpObject.reject();
  }
  csvpObject.resolve(str);
};

function isCsvFormat(str: string) {
  const array = str
    .split(/[\r\n]/)
    .filter((row) => row.match(/^[^#]/) && row !== '');
  const header = array.shift();
  const length = header.split(',').length;
  const isSameLength = array.reduce(
    (acc, n) => acc && n.split(',').length === length,
    true
  );
  return isSameLength;
}
