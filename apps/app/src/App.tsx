import { StyleSheet, ScrollView, View } from 'react-native';
import { DraxProvider, DraxView } from 'react-native-drax';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const App = () => {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: 'pink',
      }}
    >
      <DraxProvider>
        <View style={styles.container}>
          <ScrollView horizontal>
            <DraxView
              style={styles.draggable}
              onDragStart={() => {
                console.log('start drag');
              }}
              focusable={false}
              draggable={false}
              payload="world"
            />
            <DraxView
              style={styles.draggable}
              onDragStart={() => {
                console.log('start drag');
              }}
              payload="world"
            />
            <DraxView
              style={styles.draggable}
              onDragStart={() => {
                console.log('start drag');
              }}
              payload="world"
            />
            <DraxView
              style={styles.draggable}
              onDragStart={() => {
                console.log('start drag');
              }}
              payload="world"
            />
            <DraxView
              style={styles.draggable}
              onDragStart={() => {
                console.log('start drag');
              }}
              payload="world"
            />
            <DraxView
              style={styles.draggable}
              onDragStart={() => {
                console.log('start drag');
              }}
              payload="world"
            />
          </ScrollView>
          <DraxView
            style={styles.receiver}
            onReceiveDragEnter={({ dragged: { payload } }) => {
              console.log(`hello ${payload}`);
            }}
            onReceiveDragExit={({ dragged: { payload } }) => {
              console.log(`goodbye ${payload}`);
            }}
            onReceiveDragDrop={({ dragged: { payload } }) => {
              console.log(`received ${payload}`);
            }}
          />
        </View>
      </DraxProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  draggable: {
    width: 100,
    height: 100,
    backgroundColor: 'black',
    marginHorizontal: 10,
  },
  receiver: {
    width: 100,
    height: 100,
    backgroundColor: 'green',
  },
});
