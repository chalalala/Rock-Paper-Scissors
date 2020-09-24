import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native';

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

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gamePrompt: 'Choose your weapon!',
      userChoice: {},
      computerChoice: {}
    };
  };
  onPress = userChoice => {
    const [result, compChoice] = getRoundOutcome(userChoice);

    const newUserChoice = CHOICES.find(choice => choice.name === userChoice);
    const newComputerChoice = CHOICES.find(choice => choice.name === compChoice);
  
    this.setState({
      userChoice: newUserChoice,
      computerChoice: newComputerChoice,
      gamePrompt: result
    })
  }
  
  render(){
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30, color: getResultColor(this.state.gamePrompt) }}>{this.state.gamePrompt}</Text>
        <View style={styles.choicesContainer}>
          <ChoiceCard
            player="Player"
            choice={this.state.userChoice}
          />
          <Text style={{ color: '#250902' }}>vs</Text>
          <ChoiceCard
            player="Computer"
            choice={this.state.computerChoice}
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
    backgroundColor: '#e9ebee'
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
  }
});
