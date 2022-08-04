import {Text} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

export const CButton = (props: any) => {
  return (
    <Button
      style={{margin: '2%', alignSelf: 'center'}}
      
      mode={'contained'}
      testID={props.testID}
      color={"skyblue"}
      disabled={props.isDisable}
      onPress={props.onPress}>
      
      <Text style={{color:'white'}}>{props.title}</Text>
    </Button>
  );
};
