export const initialTree = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { id: "2", name: "main.jsx", type: "file", parentId: "1" },
      {
        id: "3",
        name: "components",
        type: "folder",
        parentId: "1",
        children: [
          { id: "4", name: "Header.jsx", type: "file", parentId: "3" },
        ],
      },
    ],
  },
  {
    id: "5",
    name: "index.html",
    type: "file",
  },
];
