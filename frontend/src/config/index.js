

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


export const shoppingViewHeaderMenuItems = [
  {
    id:'home',
    label:'Home',
    path:'/shop/home'
  },
  {
    id:'shop',
    label:'Shop',
    path:'/shop/listing'
  },
  {
    id:'about',
    label:'About Us',
    path:'/shop/listing'
  },
  {
    id:'contact',
    label:'Contact Us',
    path:'/shop/listing'
  },  
];


export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];



export const addressFormControls = [
  {
    label: "Address Line 1",
    name: "line1",
    componentType: "input",
    type: "text",
    placeholder: "Enter address line 1",
  },
  {
    label: "Address Line 2",
    name: "line2",
    componentType: "input",
    type: "text",
    placeholder: "Enter address line 2 (optional)",
  },
  {
    label: "City",
    name: "city",
    componentType: "select",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Province",
    name: "province",
    componentType: "input",
    type: "text",
    placeholder: "Enter your province",
  },
  {
    label: "Postal Code",
    name: "postalCode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your postal code",
  },
  {
    label: "Country",
    name: "country",
    componentType: "select",
    options: [
      { label: "Sri Lanka", value: "srilanka" }
    ],
  },
  {
    label: "Phone Number",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your 10-digit phone number",
  },
  {
    label: "Address Type",
    name: "type",
    componentType: "select",
    options: [
      { label: "Home", value: "home" },
      { label: "Work", value: "work" },
      { label: "Other", value: "other" },
    ],
  },
  
];
