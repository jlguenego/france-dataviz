export enum CsvType {
  MAP,
  PLANNING,
}

export class Csv {
  rawContent: string;
  comments: string[];
  contents: string[];

  constructor() {
    this.rawContent = localStorage.getItem('current-csv-content');
    if (!this.rawContent) {
      throw new Error('csv empty');
    }

    this.comments = this.rawContent.split(/[\r\n]+/).filter((row) => {
      return row.startsWith('# ');
    });

    this.contents = this.rawContent
      // remove the windows \r
      .replace('\r', '')
      // split in lines
      .split('\n')
      // trim white space
      .map((r) => r.trim())
      // filter comment
      .filter((r) => !r.startsWith('#'))
      // filter empty lines
      .filter((r) => r !== '');
  }

  hasColumn(key: string): boolean {
    return this.contents[0].split(',').includes(key);
  }

  getCommandValue(key: string) {
    const command = '# ' + key + '=';
    return this.comments
      .filter((r) => r.startsWith(command))[0]
      ?.substr(command.length);
  }

  getContent(): String {
    return this.contents.join('\n');
  }

  getType(): CsvType {
    if (this.hasColumn('zipcode')) {
      return CsvType.MAP;
    }
    return CsvType.PLANNING;
  }
}
