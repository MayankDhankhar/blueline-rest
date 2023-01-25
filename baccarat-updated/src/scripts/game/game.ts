import * as PIXI from "pixi.js";
import { ICard } from "../interfaces/ICard";
import { Utils } from "../system/utils";
import { Constants } from "./constants";

export class Game extends PIXI.Container {
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

  private uiContainer: PIXI.Container = new PIXI.Container();
  private buttonContainer: PIXI.Container = new PIXI.Container();
  private bankerContainer: PIXI.Container = new PIXI.Container();
  private playerContainer: PIXI.Container = new PIXI.Container();

  constructor() {
    super();
    this.createUI();
  }

  private createUI(): void {
    this.addChild(this.uiContainer);

    this.createTitle();

    const line_1: PIXI.Graphics = Utils.createLine(new PIXI.Point(0, 100), new PIXI.Point(this.width, 100), 4, 0xffd900);
    this.uiContainer.addChild(line_1);
    
    this.createBanker();
    this.createPlayer();

    const line_2: PIXI.Graphics = Utils.createLine(new PIXI.Point(0, 400), new PIXI.Point(this.width, 400), 4, 0xffd900);
    this.uiContainer.addChild(line_2);

    this.createBankerBet();
    this.createPlayerBet();
    this.createTieBet();

    const line_3: PIXI.Graphics = Utils.createLine(new PIXI.Point(0, 570), new PIXI.Point(this.width, 570), 4, 0xffd900);
    this.uiContainer.addChild(line_3);

    this.createTotalPayout();

    const line_4: PIXI.Graphics = Utils.createLine(new PIXI.Point(0, 620), new PIXI.Point(this.width, 620), 4, 0xffd900);
    this.uiContainer.addChild(line_4);

    this.createControllButtons();
  }

  private createControllButtons(): void {
    this.uiContainer.addChild(this.buttonContainer);

    const textStyle = {fontFamily: 'Arial', fontSize: 15};

    const pos_1: PIXI.Point = Utils.pos(0, 0);
    const explainButton: PIXI.Graphics = Utils.createRect(pos_1, 200, 20, 0xfeffc6);
    explainButton.name = "EXPLAIN_BUTTON";
    explainButton.cursor = "pointer";
    const explainText: PIXI.Text = new PIXI.Text("About game (Open console)", textStyle);
    explainText.position.set(7, 0);
    explainButton.addChild(explainText);
    this.buttonContainer.addChild(explainButton);

    const pos_2: PIXI.Point = Utils.pos(220, 0);
    const shuffleButton: PIXI.Graphics = Utils.createRect(pos_2, 120, 20, 0xfeffc6);
    shuffleButton.name = "SHUFFLE_BUTTON";
    shuffleButton.cursor = "pointer";
    const shuffleText: PIXI.Text = new PIXI.Text("Shuffle the deck", textStyle);
    shuffleText.position.set(225, 0);
    shuffleButton.addChild(shuffleText);
    this.buttonContainer.addChild(shuffleButton);

    const pos_3: PIXI.Point = Utils.pos(380, 0);
    const dealHandButton: PIXI.Graphics = Utils.createRect(pos_3, 100, 20, 0xfeffc6);
    dealHandButton.name = "DEAL_HAND_BUTTON";
    dealHandButton.cursor = "pointer";
    const dealText: PIXI.Text = new PIXI.Text("Deal a hand", textStyle);
    dealText.position.set(390, 0);
    dealHandButton.addChild(dealText);
    this.buttonContainer.addChild(dealHandButton);

    this.buttonContainer.position.set(30, 650);

    explainButton.on("click", () => this.explainTheGame(), this);
    shuffleButton.on("click", () => this.shuffleShoe(), this);
    dealHandButton.on("click", () => this.dealAHand(), this);

    explainButton.interactive = true;
    shuffleButton.interactive = true;
    dealHandButton.interactive = false;
    
  }

  private createTotalPayout(): void {
    const {RICH_TEXT_STYLE} = Constants;
    const payoutStyle: PIXI.TextStyle = Utils.getClone(RICH_TEXT_STYLE);
    payoutStyle.fontSize = 20;
    const totalPayout: PIXI.Text = new PIXI.Text("TOTAL CREDITS: ", payoutStyle);
    totalPayout.name = "MY_CHIP_TOTAL_TEXT";
    totalPayout.position.set(300, 580);
    this.uiContainer.addChild(totalPayout);
  }

  private createTieBet(): void {
    const tieBetContainer: PIXI.Container = new PIXI.Container();
    this.uiContainer.addChild(tieBetContainer);

    const {SKEW_TEXT_STYLE} = Constants;
    const tieStyle: PIXI.TextStyle = Utils.getClone(SKEW_TEXT_STYLE);
    tieStyle.fontSize = 40;
    tieStyle.fill = ["yellow"];
    const tieBetText: PIXI.Text = new PIXI.Text("TIE BET", tieStyle);
    tieBetContainer.addChild(tieBetText);
    tieBetContainer.position.set(320, 400);

    const betField: HTMLInputElement = document.createElement("input");
    betField.id = "tieBet";
    betField.type = "number";
    betField.value = "0";
    betField.min = "0";
    betField.max = "1000";
    betField.step = "5";
    document.body.appendChild(betField);
    betField.insertAdjacentText("beforebegin", "++++++++++++++++++++++++++++++++++++++++++");
  }

  private createBankerBet(): void {
    const bankerBetContainer: PIXI.Container = new PIXI.Container();
    this.uiContainer.addChild(bankerBetContainer);

    const {SKEW_TEXT_STYLE} = Constants;
    const bankerStyle: PIXI.TextStyle = Utils.getClone(SKEW_TEXT_STYLE);
    bankerStyle.fontSize = 40;
    bankerStyle.fill = ["red"];
    const bankerBetText: PIXI.Text = new PIXI.Text("BANKER BET", bankerStyle);
    bankerBetContainer.addChild(bankerBetText);
    bankerBetContainer.position.set(20, 400);

    const betField: HTMLInputElement = document.createElement("input");
    betField.id = "bankerBet";
    betField.type = "number";
    betField.value = "0";
    betField.min = "0";
    betField.max = "1000";
    betField.step = "25";
    for (let i =  0; i < 27; i++) {
        document.body.appendChild(document.createElement("br"));
    }
    document.body.appendChild(betField);
    betField.insertAdjacentText("beforebegin", "+++++++++++++");
  }

  private createPlayerBet(): void {
    const playerBetContainer: PIXI.Container = new PIXI.Container();
    this.uiContainer.addChild(playerBetContainer);

    const {SKEW_TEXT_STYLE} = Constants;
    const playerStyle: PIXI.TextStyle = Utils.getClone(SKEW_TEXT_STYLE);
    playerStyle.fontSize = 40;
    playerStyle.fill = ["blue"];
    const playerBetText: PIXI.Text = new PIXI.Text("PLAYER BET", playerStyle);
    playerBetContainer.addChild(playerBetText);
    playerBetContainer.position.set(500, 400);

    const betField: HTMLInputElement = document.createElement("input");
    betField.id = "playerBet";
    betField.type = "number";
    betField.value = "0";
    betField.min = "0";
    betField.max = "1000";
    betField.step = "25";
    document.body.appendChild(betField);
    betField.insertAdjacentText("beforebegin", "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  }


  private createTitle(): void {
    const { SPADE, HEART, DIAMOND, CLUB } = Constants;
    const titleText: string = `${SPADE}${HEART}${CLUB}${DIAMOND} BACCARAT ${SPADE}${HEART}${CLUB}${DIAMOND}`;
    const { RICH_TEXT_STYLE } = Constants;
    const title: PIXI.Text = new PIXI.Text(titleText, RICH_TEXT_STYLE);
    this.uiContainer.addChild(title);
  }

  private createBanker(): void {
    this.uiContainer.addChild(this.bankerContainer);
    
    const pos_3: PIXI.Point = new PIXI.Point(0, 15);
    const bankerCard_3: PIXI.Graphics = Utils.createRect(pos_3, 100, 70, 0xffffff);
    bankerCard_3.name = "BANKER_CARD_3";
    this.bankerContainer.addChild(bankerCard_3);

    const pos_2: PIXI.Point = new PIXI.Point(120, 0);
    const bankerCard_2: PIXI.Graphics = Utils.createRect(pos_2, 70, 100, 0xffffff);
    bankerCard_2.name = "BANKER_CARD_2";
    this.bankerContainer.addChild(bankerCard_2);

    const pos: PIXI.Point = new PIXI.Point(210, 0);
    const bankerCard_1: PIXI.Graphics = Utils.createRect(pos, 70, 100, 0xffffff);
    bankerCard_1.name = "BANKER_CARD_1";
    this.bankerContainer.addChild(bankerCard_1);

    const { SKEW_TEXT_STYLE } = Constants;
    const bankerStyle: PIXI.TextStyle = Utils.getClone(SKEW_TEXT_STYLE);
    bankerStyle.fill = ['red'];
    const bankerText: PIXI.Text = new PIXI.Text("BANKER", bankerStyle);
    bankerText.position.set(this.bankerContainer.width / 2 - bankerText.width / 2, 130);
    this.bankerContainer.addChild(bankerText);

    this.bankerContainer.position.set(20, 150);
  }

  private createPlayer(): void {
    this.uiContainer.addChild(this.playerContainer);

    const pos: PIXI.Point = new PIXI.Point(0, 0);//0, 0
    const playerCard_1: PIXI.Graphics = Utils.createRect(pos, 70, 100, 0xffffff);
    playerCard_1.name = "PLAYER_CARD_1";
    this.playerContainer.addChild(playerCard_1);

    const pos_2: PIXI.Point = new PIXI.Point(90, 0);//120, 0
    const playerCard_2: PIXI.Graphics = Utils.createRect(pos_2, 70, 100, 0xffffff);
    playerCard_2.name = "PLAYER_CARD_2";
    this.playerContainer.addChild(playerCard_2);

    const pos_3: PIXI.Point = new PIXI.Point(180, 15); // 210, 15
    const playerCard_3: PIXI.Graphics = Utils.createRect(pos_3, 100, 70, 0xffffff);
    playerCard_3.name = "PLAYER_CARD_3";
    this.playerContainer.addChild(playerCard_3);

    const { SKEW_TEXT_STYLE } = Constants;
    const playerStyle: PIXI.TextStyle = Utils.getClone(SKEW_TEXT_STYLE);
    playerStyle.fill = ['blue'];
    const playerText: PIXI.Text = new PIXI.Text("PLAYER", playerStyle);
    playerText.position.set(this.playerContainer.width / 2 - playerText.width / 2, 130);
    this.playerContainer.addChild(playerText);

    this.playerContainer.position.set(500, 150);
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

  private shuffleShoe(): void {
    this.createTheShoe();
    this.shuffleTheCards();
    this.burnCards();
  }

  private createTheShoe(): ICard[] {
    this.theShoe = [];
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
      "King",
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
      "K",
    ];

    this.suits = ["Heart", "Diamond", "Spade", "Club"];
    this.decks = 8;
    let card: ICard;
    if (this.theShoe.length === 0) {
      for (let deck = 1; deck <= this.decks; deck++) {
        for (let suit = 0; suit < this.suits.length; suit++) {
          for (let name = 0; name < this.names.length; name++) {
            card = {
              name: this.names[name],
              suit: this.suits[suit],
              value: name + 1 > 10 ? 0 : name + 1,
              deck: deck,
              image: this.images[name],
            };

            this.theShoe.push(card);
          }
        }
      }
    }
    return this.theShoe;
  }

  private shuffleTheCards() {
    let index_1: number;
    let index_2: number;
    let temp: ICard;
    for (let i = 0; i < this.theShoe.length * 2; i++) {
      index_1 = Math.floor(Math.random() * this.theShoe.length);
      index_2 = Math.floor(Math.random() * this.theShoe.length);
      temp = this.theShoe[index_1];
      this.theShoe[index_1] = this.theShoe[index_2];
      this.theShoe[index_2] = temp;
    }
  }

  private burnCards(): void {
    this.theDiscard = [];
    let numBurnCards: number =
      this.theShoe[0].value === 0 ? 10 : this.theShoe[0].value;
    for (let i = 0; i <= numBurnCards; i++) {
      this.theDiscard.push(this.theShoe.shift()!);
    }
    this.buttonContainer.getChildByName("DEAL_HAND_BUTTON").interactive = true;
    const totalChips: PIXI.Text = this.uiContainer.getChildByName("MY_CHIP_TOTAL_TEXT");
    totalChips.text = `TOTAL CREDITS: ${this.myRunningChipTotal}`;
    console.log("The deck is shuffled. We are ready to play.");
  }

  private dealAHand() {
    this.clearTheTable();
  }

  private clearTheTable(): void {
    let playerCard: PIXI.Graphics;
    let bankerCard: PIXI.Graphics;
    for (let i = 1; i < 4; i++) {
        playerCard = this.playerContainer.getChildByName(`PLAYER_CARD_${i}`);
        playerCard.children.length = 0;
        console.log(`PLAYER_CARD_${i}`, playerCard.position);
        bankerCard =  this.bankerContainer.getChildByName(`BANKER_CARD_${i}`);
        bankerCard.children.length = 0;
        console.log(`BANKER_CARD_${i}`, bankerCard.position);
    }

    this.dealFirstFourCards();
  }

  private dealFirstFourCards(): void {
    this.playerHand.push(this.theShoe.shift()!);
    this.bankerHand.push(this.theShoe.shift()!);
    this.playerHand.push(this.theShoe.shift()!);
    this.bankerHand.push(this.theShoe.shift()!);
    console.log(this.playerHand, this.bankerHand);
    this.showFirstFourCards();
  }

  private getFillColor(suit: string): string {
    if (suit === "Spade" || suit === "Club") {
      return "black";
    }
    return "red";
  }

  private getSuitEmoji(suit: string): string {
    const { SPADE, CLUB, HEART, DIAMOND} = Constants;
    switch (suit) {
        case "SPADE":
            return SPADE;
        case "CLUB":
            return CLUB;
        case "HEART":
            return HEART;
        default:
            return DIAMOND;
    }
  }

  private showFirstFourCards(): void {
    const commonTextStyle = {fontFamily: 'Arial', fontSize: 20};
    let playerStyle;
    let bankerStyle;
    let playerContainer: PIXI.Container;
    let bankerContainer: PIXI.Container;
    let playerCard: PIXI.Graphics;
    let bankerCard: PIXI.Graphics;
    let playerEmoji: string;
    let playerImage: string;
    let bankerEmoji: string;
    let bankerImage: string;
    let playerText: PIXI.Text;
    let bankerText: PIXI.Text;
    const playerPos: PIXI.Point[] = [new PIXI.Point(10, 40), new PIXI.Point(95, 40)];
    const bankerPos: PIXI.Point[] = [new PIXI.Point(215, 40), new PIXI.Point(130, 40)];
    for (let i = 0; i < 2; i++) {
        playerContainer = new PIXI.Container();
        playerStyle = Utils.getClone(commonTextStyle);
        playerStyle.fill = [this.getFillColor(this.playerHand[i].suit)];
        playerEmoji = this.getSuitEmoji(this.playerHand[i].suit.toUpperCase());
        playerImage = this.playerHand[i].image;
        playerText = new PIXI.Text(`${playerEmoji}   ${playerImage}`, playerStyle);
        playerContainer.addChild(playerText);
        playerCard = this.playerContainer.getChildByName(`PLAYER_CARD_${i + 1}`);
        playerContainer.position.set(playerPos[i].x, playerPos[i].y);
        playerCard.addChild(playerContainer);

        bankerContainer = new PIXI.Container();
        bankerStyle = Utils.getClone(commonTextStyle);
        bankerStyle.fill = [this.getFillColor(this.bankerHand[i].suit)];
        bankerEmoji = this.getSuitEmoji(this.bankerHand[i].suit.toUpperCase());
        bankerImage = this.bankerHand[i].image;
        bankerText = new PIXI.Text(`${bankerEmoji}   ${bankerImage}`, bankerStyle);
        bankerContainer.addChild(bankerText);
        bankerCard = this.bankerContainer.getChildByName(`BANKER_CARD_${i + 1}`);
        bankerContainer.position.set(bankerPos[i].x, bankerPos[i].y);
        bankerCard.addChild(bankerContainer);
    }
    this.totalTheHands();
  }

  private totalTheHands(): void {
    this.playerTotal =
      (this.playerHand[0].value + this.playerHand[1].value) % 10;
    this.bankerTotal =
      (this.bankerHand[0].value + this.bankerHand[1].value) % 10;
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
      if (
        this.bankerTotal === 0 ||
        this.bankerTotal === 1 ||
        this.bankerTotal === 2
      ) {
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
      } else if (
        this.bankerTotal === 6 &&
        [6, 7].includes(this.playerHand[2].value)
      ) {
        this.bankerHand.push(this.theShoe.shift()!);
      }
    }
    this.playerTotal = this.playerHand[2]
      ? (this.playerHand[0].value +
          this.playerHand[1].value +
          this.playerHand[2].value) %
        10
      : (this.playerHand[0].value + this.playerHand[1].value) % 10;
    this.bankerTotal = this.bankerHand[2]
      ? (this.bankerHand[0].value +
          this.bankerHand[1].value +
          this.bankerHand[2].value) %
        10
      : (this.bankerHand[0].value + this.bankerHand[1].value) % 10;
    this.showThirdCards();
  }

  private showThirdCards(): void {
    const commonTextStyle = {fontFamily: 'Arial', fontSize: 20};
    if (this.playerHand[2]) {
        const playerContainer: PIXI.Container = new PIXI.Container();
        const playerStyle = Utils.getClone(commonTextStyle);
        playerStyle.fill = [this.getFillColor(this.playerHand[2].suit)];
        const playerEmoji: string = this.getSuitEmoji(this.playerHand[2].suit.toUpperCase());
        const playerImage: string = this.playerHand[2].image;
        const playerText: PIXI.Text = new PIXI.Text(`${playerEmoji}   ${playerImage}`, playerStyle);
        playerContainer.addChild(playerText);
        const playerCard: PIXI.Graphics = this.playerContainer.getChildByName(`PLAYER_CARD_3`);
        const playerPos: PIXI.Point = new PIXI.Point(195, 40);
        playerContainer.position.set(playerPos.x, playerPos.y);
        playerCard.addChild(playerContainer);
    }
    if (this.bankerHand[2]) {
        const bankerContainer: PIXI.Container = new PIXI.Container();
        const bankerStyle = Utils.getClone(commonTextStyle);
        bankerStyle.fill = [this.getFillColor(this.bankerHand[2].suit)];
        const bankerEmoji: string = this.getSuitEmoji(this.bankerHand[2].suit.toUpperCase());
        const bankerImage: string = this.bankerHand[2].image;
        const bankerText: PIXI.Text = new PIXI.Text(`${bankerEmoji}   ${bankerImage}`, bankerStyle);
        bankerContainer.addChild(bankerText);
        const bankerCard: PIXI.Graphics = this.bankerContainer.getChildByName(`BANKER_CARD_3`);
        const bankerPos: PIXI.Point = new PIXI.Point(30, 40);
        bankerContainer.position.set(bankerPos.x, bankerPos.y);
        bankerCard.addChild(bankerContainer);
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
    this.playerBet = parseInt(
      (document.getElementById("playerBet")! as HTMLInputElement).value,
      10
    );
    this.bankerBet = parseInt(
      (document.getElementById("bankerBet")! as HTMLInputElement).value,
      10
    );
    this.tieBet = parseInt(
      (document.getElementById("tieBet")! as HTMLInputElement).value,
      10
    );
    console.log("playerTotal=", this.playerTotal);
    console.log("bankerTotal=", this.bankerTotal);
    this.myRunningChipTotal =
      this.myRunningChipTotal - this.playerBet - this.bankerBet - this.tieBet;
    const totalChips: PIXI.Text = this.uiContainer.getChildByName("MY_CHIP_TOTAL_TEXT");
    totalChips.text = `TOTAL CREDITS: ${this.myRunningChipTotal}`;
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
    totalChips.text = `TOTAL CREDITS: ${this.myRunningChipTotal}`;
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
    this.buttonContainer.getChildByName("DEAL_HAND_BUTTON").interactive = false;
    this.playerWinningHands = 0;
    this.bankerWinningHands = 0;
    this.tieHands = 0;
    this.totalHands = 0;
  }
}
