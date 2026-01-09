export const profileLocators = {
    searchBox: '#searchBox',
    bookCell: '.rt-td',
    deleteButton: (name) => `.rt-tr-group:has(.rt-td:has-text("${name}")) span[title="Delete"]`,
    confirmDialog: '.modal-content:has-text("Do you want to delete this book?")',
    confirmOkButton: '#closeSmallModal-ok',
    deletedDialog: '.modal-content:has-text("Book deleted")',
    deletedOkButton: '#closeSmallModal-ok',
};
