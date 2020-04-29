export class Csv {
  rawContent: string;
  comments: string[];

  constructor() {
    this.rawContent = localStorage.getItem('current-csv-content');
    if (!this.rawContent) {
      throw new Error('csv empty');
    }

    this.comments = this.rawContent.split(/[\r\n]+/).filter((row) => {
      return row.startsWith('# ');
    });
  }

  getCommandValue(key: string) {
    const command = '# ' + key + '=';
    return this.comments
      .filter((r) => r.startsWith(command))[0]
      ?.substr(command.length);
  }

  getContent() {
    return (
      this.rawContent
        // remove the windows \r
        .replace('\r', '')
        // split in lines
        .split('\n')
        // trim white space
        .map((r) => r.trim())
        // filter comment
        .filter((r) => !r.startsWith('#'))
        // filter empty lines
        .filter((r) => r !== '')
        // reform a string
        .join('\n')
    );
  }
}
