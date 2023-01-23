import { ICard } from "../interfaces/ICard";

export class Game {
    private theShoe: ICard[] = [];
    private theDiscard: ICard[] = [];
    private playerWinningHands = 0;
    private bankerWinningHands = 0;
    private tieHands = 0;
    private totalHands = 0;
    private myRunningChipTotal = 1000;

    private playerTotal: number = 0;
    private bankerTotal: number = 0;
    private playerWins = false;
    private bankerWins = false;
    private resultIsATie = false;
    private playerHand: ICard[] = [];
    private bankerHand: ICard[] = [];
    private playerBet: number = 0;
    private bankerBet: number = 0;
    private tieBet: number = 0;

    private names: string[] = [];
    private images: string[] = [];
    private suits: string[] = [];
    private decks: number = 0;

    constructor() {
        document.getElementById("aboutTheGame")!.addEventListener("click", () => this.explainTheGame());
        document.getElementById("shuffleButton")!.addEventListener("click", () => this.createShoe());
        document.getElementById("dealButton")!.addEventListener("click", () => this.dealAHand());
        (document.getElementById("dealButton")! as HTMLSelectElement).disabled = true;
    }

    private explainTheGame(): void {
        console.log("WELCOME TO BACCARAT GAME!!!");
        console.log("To play baccarat, you must bet on a side, Player or Banker.");
        console.log("The value of a hand is the sum of the cards.");
        console.log("10, J, Q, and K are worth 0 points.");
        console.log("A is 1 point, 2 is 2 points, 3 is 3 points, etc.");
        console.log(
            "The value of a hand is the LAST digit of the total of all the cards."
        );
        console.log("For example 9+8 is not 17, but instead 7");
        console.log("Whichever side gets closest to 9, without going over wins!");
        console.log("You cannot bet on BOTH the player and the banker. Either or.");
        console.log("The Tie is a bet that the player and banker tie.");
        console.log(
            "A tutorial: https://www.caesars.com/casino-gaming-blog/latest-posts/table-games/baccarat/how-to-play-baccarat#.WysD-adKhPY"
        );
        console.log(
            "A link for the banker hit chart: http://photos1.blogger.com/blogger/4295/1891/1600/baccarat-table02.2.jpg"
        );
        console.log("Let's shuffle!");
        console.log("Press the Shuffle the Deck button to shuffle.");
        console.log("Then make your bets.");
        console.log("Press Deal to deal a hand.");
    }

    private createShoe(): void {
        this.theDiscard = [];
        this.theShoe = [];
        this.createTheShoe();
        this.shuffleTheCards();
        this.burnCards();
    }

    private createTheShoe(): ICard[] {
        this.names = [
            "Ace",
            "Two",
            "Three",
            "Four",
            "Five",
            "Six",
            "Seven",
            "Eight",
            "Nine",
            "Ten",
            "Jack",
            "Queen",
            "King"
        ];

        this.images = [
            "A",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K"
        ];

        this.suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
        this.decks = 8;
        if (this.theShoe.length === 0) {
            for (let deck = 1; deck <= this.decks; deck++) {
                for (let suit = 0; suit < this.suits.length; suit++) {
                    for (let name = 0; name < this.names.length; name++) {
                        let card: ICard = {
                            name: this.names[name],
                            suit: this.suits[suit],
                            value: (name + 1) > 10 ? 0 : (name + 1),
                            deck: deck,
                            image: this.images[name]
                        };

                        this.theShoe.push(card);
                    }
                }
            }
        }
        return this.theShoe;
    }

    private shuffleTheCards() {
        for (let i = 0; i < 1000; i++) {
            let location1 = Math.floor(Math.random() * this.theShoe.length);
            let location2 = Math.floor(Math.random() * this.theShoe.length);
            let temp = this.theShoe[location1];
            this.theShoe[location1] = this.theShoe[location2];
            this.theShoe[location2] = temp;
        }
    }

    private burnCards(): void {
        let numBurnCards = this.theShoe[0].value === 0 ? 10 : this.theShoe[0].value;
        for (let i = 0; i <= numBurnCards; i++) {
            this.theDiscard.push(this.theShoe.shift()!);
        }
        (document.getElementById("dealButton")! as HTMLSelectElement).disabled = false;
        document.querySelector("#myChipTotal")!.innerHTML = `${this.myRunningChipTotal}`;
        console.log("The deck is shuffled. We are ready to play.");
    }

    private dealAHand() {
        this.clearTheTable();
    }

    private clearTheTable(): void {
        document.querySelector("#playerFirst .suit")!.innerHTML = "";
        document.querySelector("#playerFirst .image")!.innerHTML = "";
        document.querySelector("#playerSecond .suit")!.innerHTML = "";
        document.querySelector("#playerSecond .image")!.innerHTML = "";
        document.querySelector("#bankerFirst .suit")!.innerHTML = "";
        document.querySelector("#bankerFirst .image")!.innerHTML = "";
        document.querySelector("#bankerSecond .suit")!.innerHTML = "";
        document.querySelector("#bankerSecond .image")!.innerHTML = "";
        document.querySelector("#playerThird .suit")!.innerHTML = "";
        document.querySelector("#playerThird .image")!.innerHTML = "";
        document.querySelector("#bankerThird .suit")!.innerHTML = "";
        document.querySelector("#bankerThird .image")!.innerHTML = "";
        document.querySelector("#playerFirst")!
            .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
        document.querySelector("#playerSecond")!
            .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
        document.querySelector("#bankerFirst")!
            .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
        document.querySelector("#bankerSecond")!
            .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
        document.querySelector("#playerThird")!
            .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
        document.querySelector("#bankerThird")!
            .classList.remove("Diamonds", "Hearts", "Spades", "Clubs");
        this.dealFirstFourCards();
    }

    private dealFirstFourCards(): void {
        this.playerHand.push(this.theShoe.shift()!);
        this.bankerHand.push(this.theShoe.shift()!);
        this.playerHand.push(this.theShoe.shift()!);
        this.bankerHand.push(this.theShoe.shift()!);
        console.log(this.playerHand, this.bankerHand)
        this.showFirstFourCards();
    }

    private suitChanger(suit: string): string {
        if (suit === "Spades") {
            return "&spades;";
        } else if (suit === "Hearts") {
            return "&hearts;";
        } else if (suit === "Clubs") {
            return "&clubs;";
        } else {
            return "&diams;";
        }
    }

    private showFirstFourCards(): void {
        if (this.playerHand[0]) {
            document.querySelector("#playerFirst .suit")!.innerHTML = this.suitChanger(
                this.playerHand[0].suit
            );
            document.querySelector("#playerFirst .image")!.innerHTML = this.playerHand[0].image;
            document.querySelector("#playerFirst")!.classList.add(this.playerHand[0].suit);
        }
        if (this.playerHand[1]) {
            document.querySelector("#playerSecond .suit")!.innerHTML = this.suitChanger(
                this.playerHand[1].suit
            );
            document.querySelector("#playerSecond .image")!.innerHTML = this.playerHand[1].image;
            document.querySelector("#playerSecond")!.classList.add(this.playerHand[1].suit);
        }
        if (this.bankerHand[0]) {
            document.querySelector("#bankerFirst .suit")!.innerHTML = this.suitChanger(
                this.bankerHand[0].suit
            );
            document.querySelector("#bankerFirst .image")!.innerHTML = this.bankerHand[0].image;
            document.querySelector("#bankerFirst")!.classList.add(this.bankerHand[0].suit);
        }
        if (this.bankerHand[1]) {
            document.querySelector("#bankerSecond .suit")!.innerHTML = this.suitChanger(
                this.bankerHand[1].suit
            );
            document.querySelector("#bankerSecond .image")!.innerHTML = this.bankerHand[1].image;
            document.querySelector("#bankerSecond")!.classList.add(this.bankerHand[1].suit);
        }
        this.totalTheHands();
    }

    private totalTheHands(): void {
        this.playerTotal = (this.playerHand[0].value + this.playerHand[1].value) % 10;
        this.bankerTotal = (this.bankerHand[0].value + this.bankerHand[1].value) % 10;
        this.compareHandsForNaturals();
    }

    private compareHandsForNaturals(): void {
        if (
            this.playerTotal === 8 ||
            this.playerTotal === 9 ||
            this.bankerTotal === 8 ||
            this.bankerTotal === 9
        ) {
            this.compareHandsFinal();
        } else {
            this.drawThirdCards();
        }
    }

    private drawThirdCards(): void {
        if (this.playerTotal <= 5) {
            this.playerHand.push(this.theShoe.shift()!);
        }
        if (!this.playerHand[2]) {
            if (this.bankerTotal <= 5) {
                this.bankerHand.push(this.theShoe.shift()!);
            }
        }
        if (this.playerHand[2]) {
            if (this.bankerTotal === 0 || this.bankerTotal === 1 || this.bankerTotal === 2) {
                this.bankerHand.push(this.theShoe.shift()!);
            } else if (this.bankerTotal === 3 && this.playerHand[2].value !== 8) {
                this.bankerHand.push(this.theShoe.shift()!);
            } else if (
                this.bankerTotal === 4 &&
                [2, 3, 4, 5, 6, 7].includes(this.playerHand[2].value)
            ) {
                this.bankerHand.push(this.theShoe.shift()!);
            } else if (
                this.bankerTotal === 5 &&
                [4, 5, 6, 7].includes(this.playerHand[2].value)
            ) {
                this.bankerHand.push(this.theShoe.shift()!);
            } else if (this.bankerTotal === 6 && [6, 7].includes(this.playerHand[2].value)) {
                this.bankerHand.push(this.theShoe.shift()!);
            }
        }
        this.playerTotal = this.playerHand[2]
            ? (this.playerHand[0].value + this.playerHand[1].value + this.playerHand[2].value) % 10
            : (this.playerHand[0].value + this.playerHand[1].value) % 10;
        this.bankerTotal = this.bankerHand[2]
            ? (this.bankerHand[0].value + this.bankerHand[1].value + this.bankerHand[2].value) % 10
            : (this.bankerHand[0].value + this.bankerHand[1].value) % 10;
        this.showThirdCards();
    }

    private showThirdCards(): void {
        if (this.playerHand[2]) {
            document.querySelector("#playerThird .suit")!.innerHTML = this.suitChanger(
                this.playerHand[2].suit
            );
            document.querySelector("#playerThird .image")!.innerHTML = this.playerHand[2].image;
            document.querySelector("#playerThird")!.classList.add(this.playerHand[2].suit);
        }
        if (this.bankerHand[2]) {
            document.querySelector("#bankerThird .suit")!.innerHTML = this.suitChanger(
                this.bankerHand[2].suit
            );
            document.querySelector("#bankerThird .image")!.innerHTML = this.bankerHand[2].image;
            document.querySelector("#bankerThird")!.classList.add(this.bankerHand[2].suit);
        }
        this.compareHandsFinal();
    }

    private compareHandsFinal(): void {
        if (this.playerTotal > this.bankerTotal) {
            this.playerWins = true;
        } else if (this.playerTotal < this.bankerTotal) {
            this.bankerWins = true;
        } else if (this.playerTotal === this.bankerTotal) {
            this.resultIsATie = true;
            console.log("It is a TIE. The bank and player both have", this.bankerTotal);
        }
        this.bonusHands();
    }

    private bonusHands(): void {
        if (this.resultIsATie) {
            console.log("TIE PAYS 8 TO 1");
        } else {
            console.log("No bonuses ocurred this hand");
        }
        this.countHandTotals();
    }

    private countHandTotals(): void {
        if (this.playerWins) {
            this.playerWinningHands++;
        } else if (this.bankerWins) {
            this.bankerWinningHands++;
        } else if (this.resultIsATie) {
            this.tieHands++;
        } else {
            console.log("Error in countHandTotals");
        }
        this.totalHands++;
        console.log("Hand number:", this.totalHands);
        console.log("Player Winning Hands:", this.playerWinningHands);
        console.log("Banker Winning Hands:", this.bankerWinningHands);
        console.log("Ties:", this.tieHands);
        this.updateRunningChipTotal();
    }

    private updateRunningChipTotal(): void {
        this.playerBet = parseInt((document.getElementById("playerBet")! as HTMLInputElement).value, 10);
        this.bankerBet = parseInt((document.getElementById("bankerBet")! as HTMLInputElement).value, 10);
        this.tieBet = parseInt((document.getElementById("tieBet")! as HTMLInputElement).value, 10);
        console.log("playerTotal=", this.playerTotal);
        console.log("bankerTotal=", this.bankerTotal);
        this.myRunningChipTotal = this.myRunningChipTotal - this.playerBet - this.bankerBet - this.tieBet;
        document.querySelector("#myChipTotal")!.innerHTML = `${this.myRunningChipTotal}`;
        if (this.playerWins) {
            this.myRunningChipTotal = this.myRunningChipTotal + 2 * this.playerBet;
            if (this.playerBet) {
                console.log(
                    "The PLAYER wins with",
                    this.playerTotal,
                    "points against the banker's",
                    this.bankerTotal,
                    ". You win",
                    this.playerBet,
                    "dollars."
                );
            } else if (this.bankerBet) {
                console.log(
                    "Sorry, the PLAYER wins with",
                    this.playerTotal,
                    "points against the banker's",
                    this.bankerTotal,
                    ". You lose",
                    this.bankerBet,
                    "dollars."
                );
            }
        } else if (this.bankerWins) {
            this.myRunningChipTotal = this.myRunningChipTotal + 2 * this.bankerBet;
            if (this.bankerBet) {
              console.log(
                "The BANKER wins with",
                this.bankerTotal,
                "points against the player's",
                this.playerTotal,
                ". You win",
                this.bankerBet,
                "dollars."
              );
            } else if (this.playerBet) {
              console.log(
                "Sorry, the BANKER wins with",
                this.bankerTotal,
                "points against the player's",
                this.playerTotal,
                ". You lose",
                this.playerBet,
                "dollars."
              );
            }
          } else if (this.resultIsATie) {
            this.myRunningChipTotal =
                this.myRunningChipTotal +
                1 * this.bankerBet +
                1 * this.playerBet +
                1 * this.tieBet +
                8 * this.tieBet;
            console.log("You win", this.tieBet * 8, "dollars.");
            console.log("The banker and player push on a tie.");
        }
        document.querySelector("#myChipTotal")!.innerHTML = "";
        document.querySelector("#myChipTotal")!.innerHTML = `${this.myRunningChipTotal}`;
        console.log("Your chip total is:", this.myRunningChipTotal);
        this.discardCards();
    }

    private discardCards(): void {
        for (let i = 0; i < this.playerHand.length; i++) {
            this.theDiscard.push(this.playerHand[i]);
        }
        this.playerHand = [];
        for (let j = 0; j < this.bankerHand.length; j++) {
            this.theDiscard.push(this.bankerHand[j]);
        }
        this.bankerHand = [];
        this.resetAll();
    }

    private resetAll(): void {
        this.playerTotal = 0;
        this.bankerTotal = 0;
        this.playerWins = false;
        this.bankerWins = false;
        this.resultIsATie = false;
        this.seeIfThereIsEnoughMoney();
    }

    private seeIfThereIsEnoughMoney(): void {
        if (this.myRunningChipTotal === 0) {
            console.log("You have run out of money. Please restart the game.");
            this.stopTheGame();
        }
        this.seeIfThereAreEnoughCards();
    }

    private seeIfThereAreEnoughCards(): void {
        if (this.theShoe.length < 52) {
            console.log("The cut card is out. Please reshuffle.");
            this.stopTheGame();
        }
        console.log(
            "-------------------Hand",
            this.totalHands,
            " is over------------------------>"
        );
    }

    private stopTheGame(): void {
        console.log("Game stopped. Shuffle the deck again to reset.");
        (document.getElementById("dealButton")! as HTMLSelectElement).disabled = true;
        this.playerWinningHands = 0;
        this.bankerWinningHands = 0;
        this.tieHands = 0;
        this.totalHands = 0;
    }

}