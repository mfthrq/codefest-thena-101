import { Canister, ic, nat64, Principal, update } from 'azle';
import TokenCanister from './TokenCanister';

const tokenCanister = TokenCanister(
    Principal.fromText('bd3sg-teaaa-aaaaa-qaaba-cai')
);

export default Canister({
    payout: update([Principal, nat64], nat64, async (to, amount) => {
        try {
            return await ic.call(tokenCanister.transfer, {
                args: [to, amount]
            });
        } catch (error) {
            console.log(error);
        }

        return 0n;
    })
});
