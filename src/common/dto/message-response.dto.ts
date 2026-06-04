export class MessageResponseDto {
  messsage: string;
  args?: any[];

  constructor(message: string, ...args: any[]) {
    this.messsage = message;
    this.args = args;
  }
}
