import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState, } from 'react';
import { usePersistentState } from './usePersistentState';
type Todo = {
  id: string,
  text: string,
  done: boolean
}

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

type Filter = 'all' | 'active' | 'done'

const TODOS_STORAGE_KEY = 'TODOS_KEY'


export default function App() {

  const [text, setText] = useState<string>('')

  const [todos, setTodos, loaded] = usePersistentState<Todo[]>(TODOS_STORAGE_KEY,[])
  const [filter, setFilter, loadedFilter] = usePersistentState<Filter>("filter_key", 'all');





  const visibleTodos = todos.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );

  const addTodo = () => {
    if (!text.trim()) {
      setText('')
      return
    }
    const newTodo: Todo = { id: Date.now().toString(), text: text.trim(), done: false }
    setTodos([newTodo, ...todos])

    setText('')
  }



  const toggleTodo = (id: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.done = !todo.done
      }
      return todo
    })

    setTodos(newTodos)
  }

  const clearCompletedTodos = () => {
    const newTodos = todos.filter((todo) => {

      return (!todo.done)
    })

    setTodos(newTodos)
  }

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => {

      return (todo.id !== id)
    })

    setTodos(newTodos)
  }

  const remaining = (todos.filter((t) => !t.done)).length

  if (!loaded || !loadedFilter) {
    return <View style={styles.container}>
      <Text style={styles.subtitle}> Todos list is loading ...</Text>
    </View>
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <View style={styles.remainingViewContainer}>
        <Text style={styles.subtitle}>{remaining} Remaining</Text>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity
          onPress={clearCompletedTodos}
          style={styles.clearButton}><Text style={styles.clearButtonText}>Remove completed</Text></TouchableOpacity>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTodo}
          placeholder='Add a new task ...'
          placeholderTextColor='#999'
          returnKeyType='done'
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('all')} style={[styles.fillterButton, filter === 'all' && styles.selectedFilteredButton]}><Text>All</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('active')} style={[styles.fillterButton, filter === 'active' && styles.selectedFilteredButton]}><Text>Active</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('done')} style={[styles.fillterButton, filter === 'done' && styles.selectedFilteredButton]}><Text>Done</Text></TouchableOpacity>
      </View>
      <FlatList
        data={visibleTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TodoItem todo={item} onDelete={deleteTodo} onToggle={toggleTodo} />}
        ListEmptyComponent={<Text style={styles.empty}> {todos.length === 0 ? 'Nothing to do. Enjoy your day!' : `No ${filter} tasks.`}</Text>}

      />
    </View>
  );
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {

  return <View style={styles.item} >
    <TouchableOpacity style={styles.itemMain} onPress={() => onToggle(todo.id)}>
      <Text style={styles.check}>{todo.done ? '✅' : '⬜'}</Text>
      <Text style={[styles.itemText, todo.done && styles.itemTextDone]}>{todo.text}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onDelete(todo.id)}>
      <Text style={styles.delete}>X</Text>
    </TouchableOpacity>
  </View>
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7', paddingTop: 70, paddingHorizontal: 20 },
  title: { fontSize: 34, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 16 },
  inputRow: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  addButton: { backgroundColor: '#007aff', borderRadius: 12, width: 48, marginLeft: 8, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: 'white', fontSize: 28, lineHeight: 32 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 14, marginBottom: 8 },
  itemMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  check: { fontSize: 20, marginRight: 12 },
  itemText: { flex: 1, fontSize: 16 },
  itemTextDone: { textDecorationLine: 'line-through', color: '#aaa' },
  delete: { fontSize: 18, color: '#ff3b30', paddingLeft: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  clearButton: {
    backgroundColor: '#34c759',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: { color: 'white', fontWeight: '600' },
  remainingViewContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 8
  },
  fillterButton: {
    flex: 1,
    backgroundColor: '#34c759',
    marginHorizontal: 8,
    padding: 4,
    alignItems: 'center',
    color: 'white',
    borderRadius: 8,
  },
  selectedFilteredButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#34c759'
  }
});
