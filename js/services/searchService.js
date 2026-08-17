import productRepository from "../respositories/product.respository.js";

class SearchService {

    constructor() {

        this.minCharacters = 1;

    }


    search(query, limit = 8) {

        if (!query) {

            return [];

        }


        query =
            query
                .trim()
                .toLowerCase();


        if (
            query.length <
            this.minCharacters
        ) {

            return [];

        }


        const products =
            productRepository.getAll();


        const words =
            query.split(/\s+/);


        return products

            .map(product => {

                return {

                    product,

                    score:
                        this.calculateScore(
                            product,
                            words,
                            query
                        )

                };

            })


            .filter(
                result =>
                    result.score > 0
            )


            .sort((a, b) => {

                // Highest score first
                if (
                    b.score !== a.score
                ) {

                    return (
                        b.score -
                        a.score
                    );

                }


                // If scores are equal,
                // alphabetically sort names
                return a.product.name
                    .localeCompare(
                        b.product.name
                    );

            })


            .slice(0, limit)


            .map(
                result =>
                    result.product
            );

    }


    calculateScore(
        product,
        words,
        query
    ) {

        let score = 0;


        const name =
            this.normalize(
                product.name
            );


        const category =
            this.normalize(
                product.category
            );


        const brand =
            this.normalize(
                product.brand
            );


        const description =
            this.normalize(
                product.description
            );


        const gender =
            this.normalize(
                product.gender
            );


        const slug =
            this.normalize(
                product.slug
            );


        const tags =
            this.normalizeArray(
                product.tags
            );


        const colors =
            this.normalizeArray(
                product.colors
            );


        // ==================================
        // EXACT PRODUCT NAME
        // ==================================

        if (
            name === query
        ) {

            score += 1000;

        }


        // ==================================
        // NAME STARTS WITH SEARCH
        // ==================================

        if (
            name.startsWith(query)
        ) {

            score += 500;

        }


        // ==================================
        // NAME CONTAINS COMPLETE QUERY
        // ==================================

        if (
            name.includes(query)
        ) {

            score += 300;

        }


        // ==================================
        // CHECK EACH WORD
        // ==================================

        for (
            const word of words
        ) {

            if (!word) continue;


            // Product name
            if (
                name === word
            ) {

                score += 300;

            }
            else if (
                name.startsWith(word)
            ) {

                score += 180;

            }
            else if (
                name.includes(word)
            ) {

                score += 120;

            }


            // Category
            if (
                category === word
            ) {

                score += 150;

            }
            else if (
                category.includes(word)
            ) {

                score += 80;

            }


            // Brand
            if (
                brand === word
            ) {

                score += 120;

            }
            else if (
                brand.includes(word)
            ) {

                score += 60;

            }


            // Tags
            if (
                tags.includes(word)
            ) {

                score += 70;

            }


            // Gender
            if (
                gender.includes(word)
            ) {

                score += 50;

            }


            // Colors
            if (
                colors.includes(word)
            ) {

                score += 40;

            }


            // Slug
            if (
                slug.includes(word)
            ) {

                score += 30;

            }


            // Description
            if (
                description.includes(word)
            ) {

                score += 15;

            }

        }


        return score;

    }


    normalize(value) {

        return String(
            value || ""
        )
        .trim()
        .toLowerCase();

    }


    normalizeArray(value) {

        if (
            !Array.isArray(value)
        ) {

            return "";

        }


        return value
            .join(" ")
            .toLowerCase();

    }

}


const searchService =
    new SearchService();


export default searchService;