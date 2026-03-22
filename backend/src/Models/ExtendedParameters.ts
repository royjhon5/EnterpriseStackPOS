export class ExtendedParameters {
  private static readonly MAX_PAGE_SIZE = 500;
  pageNumber: number = 1;
  private _pageSize = 10;
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    this._pageSize =
      value > ExtendedParameters.MAX_PAGE_SIZE
        ? ExtendedParameters.MAX_PAGE_SIZE
        : value;
  }
}
