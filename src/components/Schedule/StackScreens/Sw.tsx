import React, { useState } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';

const YourComponent = () => {
    const [data, setData] = useState([
        { id: '1', text: 'Item 1' },
        { id: '2', text: 'Item 2' },
        // ... other items
    ]);

    const renderItem = ({ item }) => (
        <Swipeable
            renderRightActions={() => (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <View style={{ backgroundColor: 'red', justifyContent: 'center', padding: 10 }}>
                        <Text style={{ color: 'white' }}>Delete</Text>
                    </View>
                </TouchableOpacity>
            )}
        >
            <TouchableOpacity onLongPress={() => handleLongPress(item.id)}>
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                    <Text>{item.text}</Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );

    const handleLongPress = (itemId) => {
        // Handle long press, e.g., select the item for deletion
        console.log(`Long press on item with id ${itemId}`);
    };

    const handleDelete = (itemId) => {
        // Handle item deletion
        setData((prevData) => prevData.filter((item) => item.id !== itemId));
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
        />
    );
};

export default YourComponent;
