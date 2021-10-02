
import Cookies from 'js-cookie';
import DAO from 'scripts/utils/DAO';
import BcBaseModel from './BcBaseModel';

class MumbaiModel extends BcBaseModel {

    wallet = null;

    constructor() {
        super();
        let walletAddress = Cookies.get('walletAddress');
        this.wallet = walletAddress;
    }

    async checkToInit(): Promise<void> {
        return new Promise((resolve) => {
            if (this.wallet) {
                resolve(null);
            } else {
                this.init()
                    .then(() => {
                        resolve(null);
                    });
            }
        });
    }

    async init() {
        if (window.ethereum) {
            let ethereum = window.ethereum;
            if (!ethereum.selectedAddress) {
                await ethereum.enable();
            }
            ethereum.request({ method: 'eth_requestAccounts' });
            console.log(ethereum.selectedAddress);
            this.wallet = ethereum.selectedAddress;
            Cookies.set('walletAddress', this.wallet);
        }
    }

    async mint(tokenId: string, hash: string): Promise<any> {
        return DAO.mumbaiMint(hash);
    }
    
    async getMyNFTS(): Promise<any> {
        return new Promise((resolve) => {

        });
    }

}

export default MumbaiModel;