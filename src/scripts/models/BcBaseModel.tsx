

class BcBaseModel {

    wallet = null;

    constructor() {

    }

    async checkToInit(): Promise<void> {
        return new Promise((resolve) => {

        });
    }

    async mint(tokenId: string, hash: string): Promise<any> {

    }

    async getMyNFTS(): Promise<any> {

    }
}

export default BcBaseModel;