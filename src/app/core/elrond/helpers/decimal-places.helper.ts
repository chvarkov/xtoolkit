import BigNumber from 'bignumber.js';

export class DecimalPlacesHelper {
    static toRaw(decimals: number, amount: BigNumber.Value): BigNumber {
        return new BigNumber(10).pow(decimals).multipliedBy(amount);
    }

    static fromRaw(decimals: number, amount: BigNumber.Value): BigNumber {
        if (new BigNumber(decimals).eq(0)) {
            return new BigNumber(amount);
        }

        return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals));
    }
}
