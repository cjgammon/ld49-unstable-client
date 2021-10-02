import { ImmutableXClient } from '@imtbl/imx-link-lib';
import { Link } from '@imtbl/imx-link-sdk';
import Cookies from 'js-cookie';
import DAO from 'scripts/utils/DAO';
import BcBaseModel from './BcBaseModel';

class IMXModel extends BcBaseModel {
    link = new Link(process.env.IMX_LINK_URL)

    wallet = null;
    client: ImmutableXClient = null;

    constructor() {
        super();
        let walletAddress = Cookies.get('walletAddress');
        this.wallet = walletAddress;
    }

    async checkToInit(): Promise<void> {
        return new Promise((resolve) => {
            if (this.wallet && this.client) {
                resolve(null);
            } else {
                this.initIMX()
                    .then(() => {
                        resolve(null);
                    });
            }
        });
    }

    async initIMX() {
        const publicApiUrl: string = process.env.IMX_ENV_URL ?? '';
        const client = await ImmutableXClient.build({publicApiUrl});
        this.client = client;
        return this.linkSetup();
    }

    async linkSetup(): Promise<void> {
        if (!this.wallet) {
            // Register user, you can persist address to local storage etc.
            const res = await this.link.setup({});
            const wallet = res.address;
            this.wallet = wallet;
            Cookies.set('walletAddress', wallet);
        }
    };

    async mint(tokenId, hash): Promise<any> {
        return DAO.createMapping(tokenId, hash)
            .then(() => DAO.imxMint(tokenId, 'metadata'));
    }

    async getMyNFTS(): Promise<any> {
        return this.client.getAssets({user: this.wallet});
    }

}

export default IMXModel;