

export const registerFormControls = [

    {
        name:'userName',
        label:'User Name',
        placeholder:'Enter your user name',
        componentType:'input',
        type:'text',
    },
    {
        name:'email',
        label:'Email',
        placeholder:'Enter your  email',
        componentType:'input',
        type:'email',
    },
    {
        name:'password',
        label:'Password',
        placeholder:'Enter your passwrod',
        componentType:'input',
        type:'password',
    }
]

export const loginFormControls = [

    {
        name:'email',
        label:'Email',
        placeholder:'Enter your  email',
        componentType:'input',
        type:'email',
    },
    {
        name:'password',
        label:'Password',
        placeholder:'Enter your passwrod',
        componentType:'input',
        type:'password',
    }
]

export const addProductFormFields = [
  {
    label: "Product Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter product name",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    type: "text",
    placeholder: "Select category",
    options: [
      { id:"men", label: "Men" },
      { id:"women", label: "Women"},
      { id:"kids", label: "Kids" },
      { id:"accessories",label: "Accessories"},
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    type: "text",
    placeholder: "Select brand",
    options: [
      { id:"nike",label: "Nike", },
      { id:"adidas",label: "Adidas",  },
      { id:"puma",label: "Puma", },
      { id:"levi",label: "Levi's",  },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter regular price",
  },
  {
    label: "Sales Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter discounted price",
  },
  {
    label: "Stock Quantity",
    name: "stock",
    componentType: "input",
    type: "number",
    placeholder: "Enter stock quantity",
  },
  
];
