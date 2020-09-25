import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View, Modal } from 'react-native';
import Constants from 'expo-constants'

const CHOICES = [
  {
    name: 'rock',
    uri: 'http://pngimg.com/uploads/stone/stone_PNG13622.png'
  },
  {
    name: 'paper',
    uri: 'https://www.stickpng.com/assets/images/5887c26cbc2fc2ef3a186046.png'
  },
  {
    name: 'scissors',
    uri:
      'http://pluspng.com/img-png/png-hairdressing-scissors-beauty-salon-scissors-clipart-4704.png'
  }
];

const Button = props => {
  return(
    <TouchableOpacity
      style={styles.buttonStyle}
      onPress={() => props.onPress(props.name)}
    >
      <Text style={styles.buttonText}>
        {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
      </Text>
    </TouchableOpacity>
  )
};

const ChoiceCard = ({ player, choice: { uri, name } }) => {
  const title = name && name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <View style={styles.choiceContainer}>
      <Text style={styles.choiceDescription}>{player}</Text>
      <Image source={{ uri }} resizeMode="contain" style={styles.choiceImage} />
      <Text style={styles.choiceCardTitle}>{title}</Text>
    </View>
  );
};

const StatisticCard = ({name, value, total}) => {
  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detail}>{name}: {value}</Text>
      <Text style={styles.detail}>Percentage: {(value*100/total).toFixed(2)}%</Text>
    </View>
  )
}

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isVisible: false,
      gamePrompt: 'Choose your weapon!',
      userChoice: {},
      computerChoice: {},
      win: 0,
      lose: 0,
      tied: 0,
      total: 0,
    };
  };
  onPress = userChoice => {
    const [result, compChoice] = getRoundOutcome(userChoice);
    const newUserChoice = CHOICES.find(choice => choice.name === userChoice);
    const newComputerChoice = CHOICES.find(choice => choice.name === compChoice);
  
    this.setState({
      userChoice: newUserChoice,
      computerChoice: newComputerChoice,
      gamePrompt: result,
    })

    if (result === 'Victory!') {this.setState(state => { return {win: state.win + 1} })};
    if (result === 'Defeat!') {this.setState(state => { return {lose: state.lose + 1} })};
    if (result === 'Tie game!') {this.setState(state => { return {tied: state.tied + 1} })};
    this.setState(state => {state.total = state.win + state.lose + state.tied});
  };
  displayModal(show){
    this.setState({isVisible: show})
  };
  // resetStatistics = () => {
  //   this.setState = {
  //     gamePrompt: 'Choose your weapon!',
  //     userChoice: {},
  //     computerChoice: {},
  //     win: 0,
  //     lose: 0,
  //     tied: 0,
  //     total: 0,
  //   };
  // };
  
  render(){
    const {userChoice, computerChoice, win, lose, tied, total} = this.state;
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30, color: getResultColor(this.state.gamePrompt) }}>{this.state.gamePrompt}</Text>
        <View style={styles.choicesContainer}>
          <ChoiceCard
            player="Player"
            choice={userChoice}
          />
          <Text style={{ color: '#250902' }}>vs</Text>
          <ChoiceCard
            player="Computer"
            choice={computerChoice}
          />
        </View>

        <View style={styles.buttonContainer}>        
          {
            CHOICES.map(choice => {
              return (
                <Button key={choice.name} name={choice.name} onPress={this.onPress}/>
              )
            })
          }
        </View>
        
        <View>
          <Text
            style={{marginTop:10}} 
            onPress={() => this.displayModal(true)}>
            View statistics
          </Text>
        </View>

        <Modal
            animationType = {"slide"}
            transparent={false}
            visible={this.state.isVisible}
        >
          <View>
            <Text style={styles.closeButton}
              onPress={() => {this.displayModal(false);}}>
                X
            </Text>
            
            <View>
              <Text style={styles.title}>Statistics</Text>
              <StatisticCard name="Win" value={win} total={total}/> 
              <StatisticCard name="Lose" value={lose} total={total}/>
              <StatisticCard name="Tied" value={tied} total={total}/>
              <Text style={styles.total}>Total games: {total}</Text>
            </View>

            {/* <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={this.resetStatistics}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View> */}
          </View>    
        </Modal>
      </View>  
    );
  }
}

const randomComputerChoice = () =>
  CHOICES[Math.floor(Math.random() * CHOICES.length)];

const getRoundOutcome = userChoice => {
  const computerChoice = randomComputerChoice().name;
  let result;

  if (userChoice === 'rock') {
    result = computerChoice === 'scissors' ? 'Victory!' : 'Defeat!';
  }
  if (userChoice === 'paper') {
    result = computerChoice === 'rock' ? 'Victory!' : 'Defeat!';
  }
  if (userChoice === 'scissors') {
    result = computerChoice === 'paper' ? 'Victory!' : 'Defeat!';
  }

  if (userChoice === computerChoice) result = 'Tie game!';
  return [result, computerChoice];
};

const getResultColor = gamePrompt => {
  if (gamePrompt === 'Victory!') return 'green';
  if (gamePrompt === 'Defeat!') return 'red';
  return 'black';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9ebee',
    marginTop: Constants.statusBarHeight
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    width: 200,
    margin: 10,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#640D14',
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  choicesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',   
    borderColor: 'grey',
    borderWidth: 2,
    marginHorizontal: 10,
    marginVertical: 30,
    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  choiceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  choiceDescription: {
    fontSize: 25,
    color: '#250902',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  choiceCardTitle: {
    fontSize: 30,
    color: '#250902'
  },
  choiceImage: {
    width: 150,
    height: 150,
    padding: 10,
  },
  closeButton: {
    textAlign: 'right',
    color: 'grey',
    fontSize: 25,
    margin: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30
  },
  detailContainer: {
    marginHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detail: {
    fontSize:20,
  },
  total: {
    fontSize:20,
    fontWeight:'600',
    textAlign:'center',
    marginTop:20,
  },
  // resetButton: {
  //   width: 100,
  //   height: 50,
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginTop: 20,
  //   backgroundColor: '#640D14',
  // }
});
