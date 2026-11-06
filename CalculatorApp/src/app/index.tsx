import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, StyleProp, ViewStyle } from "react-native";
import React, { useState } from "react";

type Operator = '+' | '-' | 'x' | '÷'

// type Key =
//   | { type: 'digit'; label: string; wide?: boolean }
//   | { type: 'dot'; label: '.' }
//   | { type: 'operator'; label: Operator }
//   | { type: 'clear'; label: 'C' }
//   | { type: 'sign'; label: '±' }
//   | { type: 'percent'; label: '%' }
//   | { type: 'equals'; label: '=' };

// const KEYS: Key[][] = [
//   [{ type: 'clear', label: 'C' }, { type: 'sign', label: '±' }, { type: 'percent', label: '%' }, { type: 'operator', label: '÷' }],
//   [{ type: 'digit', label: '7' }, { type: 'digit', label: '8' }, { type: 'digit', label: '9' }, { type: 'operator', label: '×' }],
//   [{ type: 'digit', label: '4' }, { type: 'digit', label: '5' }, { type: 'digit', label: '6' }, { type: 'operator', label: '−' }],
//   [{ type: 'digit', label: '1' }, { type: 'digit', label: '2' }, { type: 'digit', label: '3' }, { type: 'operator', label: '+' }],
//   [{ type: 'digit', label: '0', wide: true }, { type: 'dot', label: '.' }, { type: 'equals', label: '=' }],
// ];


type ButtonProps = {
  label: string,
  onPress: () => void,
  active?: boolean,
  style?: StyleProp<ViewStyle>
}

function Button({ label, onPress, style, active = false }: ButtonProps) {
  return <TouchableOpacity style={[styles.button, style, active && styles.operatorActive]} onPress={onPress}>
    <Text style={[styles.buttonText, active && styles.operatorActiveText]}>{label}</Text>
  </TouchableOpacity>
}

function calculate(a: number, b: number, op: Operator): number {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case 'x': return a * b
    case '÷': return b === 0 ? NaN : a / b
  }
}

function formatResult(n: number): string {
  if (!isFinite(n)) return 'Error'

  return String(parseFloat(n.toPrecision(12))) // fixes 0.1 + 0.2 = 0.30000000000000004
}

export default function Index() {

  const [display, setDisplay] = useState<string>('0')
  const [previous, setPrevious] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waiting, setWaiting] = useState<boolean>(false)


  const inputDigit = (digit: string) => {

    if (waiting || display === 'Error') {
      setDisplay(digit)
      setWaiting(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDot = () => {
    if (waiting || display === 'Error') {
      setDisplay('0.')
      setWaiting(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperator = (op: Operator) => {
    const current = parseFloat(display)
    if (previous !== null && operator !== null && !waiting) {
      // Chained operation like 2 + 3 + ... : compute the first part now
      const result = calculate(previous, current, operator)
      setDisplay(formatResult(result))
      setPrevious(isFinite(result) ? result : null)
    } else {
      setPrevious(current)
    }

    setOperator(op)
    setWaiting(true)
  }

  const handleEquals = () => {
    console.log(previous)
    console.log(operator)
    console.log(display)
    if (previous === null || operator === null) return;
    const result = calculate(previous, parseFloat(display), operator);
    setDisplay(formatResult(result))
    setPrevious(null)
    setOperator(null)
    setWaiting(true)
  }

  const handleOnClear = () => {
    setDisplay('0')
    setPrevious(null)
    setOperator(null)
    setWaiting(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.displayContaner}>
        <Text style={styles.display}>{display}</Text>
      </View>

      <View style={styles.row}>
        <Button label="C" onPress={handleOnClear} />
        <Button label="±" onPress={() => { }} />
        <Button label="%" onPress={() => { }} />
        <Button label="÷" style={styles.operator} onPress={() => { handleOperator('÷') }} />
      </View>
      <View style={styles.row}>
        <Button label="7" onPress={() => inputDigit('7')} />
        <Button label="8" onPress={() => { inputDigit('8') }} />
        <Button label="9" onPress={() => { inputDigit('9') }} />
        <Button label="×" style={styles.operator} onPress={() => { handleOperator('x') }} active={waiting} />
      </View>
      <View style={styles.row}>
        <Button label="4" onPress={() => { inputDigit('4') }} />
        <Button label="5" onPress={() => { inputDigit('5') }} />
        <Button label="6" onPress={() => { inputDigit('6') }} />
        <Button label="−" style={styles.operator} onPress={() => { handleOperator('-') }} />
      </View>
      <View style={styles.row}>
        <Button label="1" onPress={() => { inputDigit('1') }} />
        <Button label="2" onPress={() => { inputDigit('2') }} />
        <Button label="3" onPress={() => { inputDigit('3') }} />
        <Button label="+" style={styles.operator} onPress={() => { handleOperator('+') }} />
      </View>
      <View style={styles.row}>
        <Button label="0" style={styles.zero} onPress={() => { inputDigit('0') }} />
        <Button label="." onPress={inputDot} />
        <Button label="=" style={styles.operator} onPress={handleEquals} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  displayContaner: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: '#1c1c1e',

  },
  display: {
    color: 'white',
    fontSize: 64,
    textAlign: 'right',
    borderWidth: 1,

    borderRadius: 8,
    borderColor: 'gray',
    flex: 1,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#505050', padding: 24, borderRadius: 40,
    alignItems: 'center', flex: 1,
    margin: 5
  },
  buttonText: { color: 'white', fontSize: 28 },
  row: { flexDirection: 'row' },
  operator: { backgroundColor: '#ff9f0a' },
  operatorActive: { backgroundColor: 'white' },
  operatorActiveText: { color: '#ff9f0a' },
  zero: { flex: 3.5 }
});
