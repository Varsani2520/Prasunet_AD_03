import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, FlatList } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRunning) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 60000, // 1 minute duration for the progress bar to fill
        useNativeDriver: false,
      }).start();
    } else {
      progress.stopAnimation();
    }
    return () => progress.stopAnimation();
  }, [isRunning]);

  const startStopwatch = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      const startTime = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10); // update every 10 milliseconds
    }
    setIsRunning(!isRunning);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setElapsedTime(0);
    setIsRunning(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
    setLaps([]);
  };

  const addLap = () => {
    setLaps((prevLaps) => [elapsedTime, ...prevLaps]);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
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
      <FlatList
        data={laps}
        renderItem={({ item, index }) => (
          <Text key={index} style={styles.lapText}>{`Lap ${index + 1}: ${formatTime(item)}`}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 25, // make the button rounded
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  lapText: {
    fontSize: 18,
    color: '#000',
    marginTop: 10,
  },
});

export default Stopwatch;
