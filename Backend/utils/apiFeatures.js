class Apifeatures {
  constructor(modelN, queryString) {
    this.modelN = modelN;
    this.queryString = queryString || {};
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          Name: {
            $regex: this.queryString.keyword,
            $options: "i", // It is used to check uppercase as well as lower case
          },
        }
      : {}; // Agar keyoword me value hai to normally search hoga values ke sath agar keyword hi nahi hai ya koi data nahi hai to empty object aa jayega jisse sirf normal search hota hai

    this.modelN = this.modelN.find({ ...keyword });
    return this;
  }

  filter() {
    if (this.queryString.Category) {
      const categoryFilter = { Category: this.queryString.Category };
      this.modelN = this.modelN.find({ ...categoryFilter });
    }
    if (this.queryString.Price) {
      const priceFilter = { Price: this.queryString.Price };
      let newPriceFilter = JSON.stringify(priceFilter);
      newPriceFilter = newPriceFilter.replace(
        /\b(gt|gte|lt|lte)\b/g,
        (key) => `$${key}`
      );

      this.modelN = this.modelN.find(JSON.parse(newPriceFilter));
    }

    return this;
  }

  

  pagination(number) {
    let pageNo = this.queryString.Pageno || 1;
    this.modeln = this.modelN
      .skip((pageNo - 1) * parseInt(number))
      .limit(parseInt(number));
    return this;
  }
}

module.exports = Apifeatures;
