import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, FlatList } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const progress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1000);
      }, 1);
    } else if (!isRunning && elapsedTime !== 0) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, elapsedTime]);

  const startStopwatch = () => {
    setIsRunning(!isRunning);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps(prevLaps => [elapsedTime, ...prevLaps]);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const milliseconds = `00${time % 1000}`.slice(-3);
    const formattedMinutes = `0${minutes % 60}`.slice(-2);
    const formattedSeconds = `0${seconds % 60}`.slice(-2);

    return `${formattedMinutes}:${formattedSeconds}:${milliseconds}`;
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <LinearGradient
      colors={['#4f5ee8', '#4f5ee8', '#dddff4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Stopwatch</Text>
        <View style={styles.timerContainer}>
          <Svg height="200" width="200" viewBox="0 0 200 200">
            <Circle
              cx="100"
              cy="100"
              r="90"
              stroke="#dddff4"
              strokeWidth="10"
              fill="none"
            />
            <AnimatedCircle
              cx="100"
              cy="100"
              r="90"
              stroke="#4f5ee8"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
        </View>
        <FlatList
          style={styles.lapsContainer}
          data={laps}
          renderItem={({ item, index }) => (
            <View style={styles.lapItem}>
              <Text style={styles.lapIndex}>{`Lap ${index + 1}`}</Text>
              <Text style={styles.lapDuration}>{formatTime(item)}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#dddff4' }]} onPress={addLap}>
            <Icon name="flag" size={30} color="#4f5ee8" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: isRunning ? '#dddff4' : '#dddff4' }]} onPress={startStopwatch}>
            <Icon name={isRunning ? 'pause' : 'play'} size={30} color="#4f5ee8" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#dddff4' }]} onPress={resetStopwatch}>
            <Icon name="refresh" size={30} color="#4f5ee8" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  lapsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#dddff4',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4f5ee8',
  },
  lapIndex: {
    fontSize: 18,
    color: '#4f5ee8',
  },
  lapDuration: {
    fontSize: 18,
    color: '#4f5ee8',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 25,
  },
});

export default Stopwatch;
