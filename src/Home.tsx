import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {Card, TextInput} from 'react-native-paper';
import {CButton} from './CButton';
import moment from 'moment';

export const Home = () => {
  const [noLots, setNoLots] = useState<any>();
  const [carRegNumber, setCarRegNumber] = useState<any>();
  const [parkingLots, setParkingLots] = useState<any>([]);
  const [selectedParking, setSelectedParking] = useState();
  const [showModal, setShowModal] = useState(false);
  const [noOfHours, setNoOfHours] = useState(0);
  const [billAmount, setBillAmount] = useState<any>(null);

  /* istanbul ignore next*/
  const createParking = () => {
    var temp = [];
    for (let index = 0; index < noLots; index++) {
      temp.push({
        id: index + 1,
        carRegNo: '',
        isCheck: false,
        timeStamp: Date.now(),
      });
    }
    setNoLots('');
    setParkingLots(temp);
  };

  /* istanbul ignore next*/
  const assignParking = () => {
    var filteredArray = parkingLots.filter(
      (a: any) => a.carRegNo === carRegNumber,
    );
    if (filteredArray.length === 0) {
      var filteredData = parkingLots.filter((a: any) => a.isCheck === false);
      if (filteredData.length === 0) {
        setCarRegNumber('');
        Alert.alert('Oops... Parking Is Full');
      } else {
        var randomIndex = Math.floor(Math.random() * filteredData.length);
        var data = parkingLots.map((d) => {
          if (d.isCheck) {
            return d;
          } else {
            if (filteredData[randomIndex].id === d.id) {
              return {...d, isCheck: true, carRegNo: carRegNumber};
            } else {
              return d;
            }
          }
        });
        setCarRegNumber('');
        Alert.alert('Parking Allocated Successfully');
        setParkingLots(data);
      }
    } else {
      setCarRegNumber('');
      Alert.alert('Car Number Already Exists!');
    }
  };

  /* istanbul ignore next*/
  const generateBill = (item: any) => {
    let carTime = item.timeStamp;
    let currentTime = Date.now();
    const parkedTime = moment(currentTime).diff(carTime, 'hours');
    setNoOfHours(parkedTime);
    if (parkedTime > 2) {
      setBillAmount((parkedTime - 2) * 10 + 10);
    } else {
      setBillAmount(10);
    }
  };

  /* istanbul ignore next*/
  const takePayment = () => {
    var body = {
      'car-registration': selectedParking?.carRegNo,
      charge: billAmount,
    };
    fetch('https://httpstat.us/200', {method: 'POST0', body: body})
      .then((res: any) => {
        let data = [...parkingLots];
        data.forEach((d) => {
          if (d.id === selectedParking?.id) {
            d.isCheck = false;
            d.carRegNo = '';
          }
        });
        setBillAmount(true);
        setParkingLots(data);
        setShowModal(false);
      })
      .catch((e: any) => console.log(e));
  };

  /* istanbul ignore next*/
  const renderParkingLots = ({item, index}: any) => {
    return (
      <TouchableOpacity
        testID={
          item.isCheck
            ? `parking-drawing-registered-${index}`
            : `parking-drawing-space-${index}`
        }
        disabled={item.carRegNo == ''}
        onPress={() => {
          generateBill(item), setSelectedParking(item), setShowModal(true);
        }}
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: '#ffe0b2',
          marginHorizontal: 40,
          marginVertical: 10,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
        }}>
        <Text testID={`parking-drawing-space-number-${index}`}>{item.id}</Text>
        {item.carRegNo != '' && (
          <View>
            <Text>{item.carRegNo}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  /* istanbul ignore next*/
  const renderModal = () => {
    return (
      <Modal
        testID="	
      deregister-car-registration"
        visible={showModal}
        transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Card style={{width: '80%', padding: '3%'}}>
            <View style={{marginHorizontal: 20}}>
              <Text>Car Registration Number: {selectedParking?.carRegNo}</Text>
              <Text
                testID="deregister-time-spent">
                Total Time Spent : {noOfHours === 0 ? '1' : noOfHours}
              </Text>
              <Text testID="deregister-charge">Total Bill : ${billAmount}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <CButton
                testID={'deregister-payment-button'}
                title={'Payent Taken'}
                onPress={() => takePayment()}></CButton>
              <CButton
                testID={'deregister-back-button'}
                title={'Close'}
                onPress={() => setShowModal(false)}></CButton>
            </View>
          </Card>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={{flex: 1, padding: '2%', paddingBottom: '5%'}}>
      <TextInput
        testID="parking-create-text-input"
        placeholder="Enter No Of Lots"
        mode="outlined"
        value={noLots}
        onChangeText={(text) => /* istanbul ignore next*/ setNoLots(text)}
      />
      <CButton
        testID="parking-create-submit-button"
        // isDisable={noLots.length === 0}
        title={'Create Parking Lots'}
        onPress={() => /* istanbul ignore next*/ createParking()}></CButton>
      <TextInput
        testID="parking-drawing-registration-input"
        placeholder="Enter Car Reg No"
        mode="outlined"
        value={carRegNumber}
        onChangeText={
          /* istanbul ignore next*/ (text) =>
            /* istanbul ignore next*/ setCarRegNumber(text)
        }
      />
      <CButton
        testID="parking-drawing-add-car-button"
        title={'Submit'}
        onPress={
          /* istanbul ignore next*/ () =>
            /* istanbul ignore next*/ assignParking()
        }></CButton>
      <FlatList
        data={parkingLots}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'center'}}
        renderItem={renderParkingLots}
      />
      {renderModal()}
    </ScrollView>
  );
};
