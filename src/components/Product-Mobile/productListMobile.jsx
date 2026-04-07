import React from "react";
import "../../App.css";
import ProdctBodyDefault from "./productBodyDefault.jsx";

const ProductListMobile = ({
  selectedOption,
  searchData,
  productDataChanger,
  displayState,
  ...rest
}) => {
  return (
    <div>
      <ProdctBodyDefault
        searchData={searchData}
        productDataChanger={productDataChanger}
      ></ProdctBodyDefault>
    </div>
  );
};

export default ProductListMobile;
