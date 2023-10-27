class Board {
    constructor(numberOfColumns, numberOfRows) {
        this.numberOfColumns = numberOfColumns;
        this.numberOfRows = numberOfRows;
        this.board = new Array(numberOfColumns).fill(0).map(() => new Array(numberOfRows).fill("White"));

    }
}