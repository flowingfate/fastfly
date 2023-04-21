import {  css } from '@microsoft/fast-element';

export const rowStyle = css`
  .row:hover {
    background-color: aqua;
  }
  .row.selected {
    background-color: red;
  }

  .col {
    border: 1px solid grey;
    padding: 2px 4px;
  }
  .col-3,.col-4 {
    text-align: center;
    cursor: pointer;
  }
`;

export const actionStyle = css`
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    gap: 4px;
  }
  .actions>button {
    cursor: pointer;
  }
`;

export const tableStyle = css`
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .title {
    text-align: center;
  }
  .rc-table {
    margin: 10px;
    width: 500px;
    border-collapse: collapse;
  }
`;
