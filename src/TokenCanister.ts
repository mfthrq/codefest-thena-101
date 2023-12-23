import {
    Canister,
    ic,
    nat64,
    Opt,
    Principal,
    StableBTreeMap,
    update,
    text,
    query
} from 'azle';

let accounts = StableBTreeMap<Principal, nat64>(0);

export default Canister({
    transfer: update([Principal, nat64], nat64, (to, amount) => {
        const from = ic.caller();

        const fromBalance = getBalance(accounts.get(from));

        if (amount > fromBalance) {
            throw new Error(`${from} has an insufficient balance`);
        }

        const toBalance = getBalance(accounts.get(to));

        accounts.insert(from, fromBalance - amount);
        accounts.insert(to, toBalance + amount);

        return amount;
    }),

    topupSaldo : update([Principal, nat64], text, (principal, amount) => {
        if (accounts.containsKey(principal)){
            let currentBalance = getBalance(accounts.get(principal));
            let finalBalance = currentBalance + amount; 
            accounts.insert(principal, finalBalance);

            return "Berhasil Top Up, Saldo saat ini: " + finalBalance;
        }

        accounts.insert(principal, amount);

        return "Berhasil Top Up, Saldo saat ini: " + amount;
    }),

    inquiry : query([Principal], nat64, (principal) => {
        return getBalance(accounts.get(principal));
    }), 
});

function getBalance(accountOpt: Opt<nat64>): nat64 {
    if ('None' in accountOpt) {
        return 0n;
    } else {
        return accountOpt.Some;
    }
}
