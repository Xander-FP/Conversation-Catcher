import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Share,
} from 'react-native';
import { gql, useQuery, useMutation } from '@apollo/client';
import PdfTile from '../shared-components/pdf-tile/pdf-tile.js';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { selectColour } from '../../../../../../apps/client/src/app/slices/colour.slice';
//import Share from 'react-native-share';

export const PdfView = ({ route, navigation }) => {
  const colourState = useSelector(selectColour).colour;
  const [moreVisible, setMoreVisible] = useState(false);

  const { text, name, id } = route.params;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: text.text,
        title: name.name,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const RENAME = gql`
    mutation setName($id: String!, $name: String!) {
      renamePDF(id: $id, name: $name) {
        id
        name
        downloaded
      }
    }
  `;

  const [rename] = useMutation(RENAME);

  return (
    <View style={styles.viewAllPage}>
      <View style={styles.viewAllTopBar}>
        <View style={styles.big_title_box}>
          <Text style={styles.big_title}>{name.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setMoreVisible(true);
            console.log(text);
          }}
        >
          <Icon name="ellipsis-h" color="#344053ff" size={30} />
        </TouchableOpacity>
      </View>

      <View style={styles.pdfTextContainer}>
        <Text style={styles.pdfText}>{text.text}</Text>
      </View>

      <View style={styles.viewAllBottomBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" color="#344053ff" size={30} />
        </TouchableOpacity>
      </View>

      <Modal
        style={styles.modal}
        isVisible={moreVisible}
        avoidKeyboard={true}
        hasBackdrop={true}
        backdropColor="white"
        onBackdropPress={() => setMoreVisible(false)}
      >
        <View style={styles.moreModalInner}>
          <TouchableOpacity
            style={styles.moreModalButton}
            onPress={() => {
              setMoreVisible(false);
              onShare();
            }}
          >
            <View style={styles.moreModalButtonContent}>
              <View style={styles.iconContainer}>
                <Icon
                  style={{ color: colourState }}
                  name="paper-plane-o"
                  size={18}
                />
              </View>
              <View style={styles.moreModalButtonText_box}>
                <Text style={styles.moreModalButtonText} ellipsizeMode={'clip'}>
                  {'Share'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.moreModalButtonDivider} />

          <TouchableOpacity
            style={styles.moreModalButton}
            onPress={async () => {
              setMoreVisible(false);
              console.log(id);
              name.name = 'otherName';
              await rename(({variables: {id: id.id, name: 'otherName'}}))
            }}
          >
            <View style={styles.moreModalButtonContent}>
              <View style={styles.iconContainer}>
                <Icon
                  style={{ color: colourState }}
                  name="pencil-square-o"
                  size={20}
                />
              </View>
              <View style={styles.moreModalButtonText_box}>
                <Text style={styles.moreModalButtonText}>{'Rename'}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.moreModalButtonDivider} />

          <TouchableOpacity
            style={styles.moreModalButton}
            onPress={() => {
              setMoreVisible(false);
              console.log('delete');
            }}
          >
            <View style={styles.moreModalButtonContent}>
              <View style={styles.iconContainer}>
                <Icon style={{ color: colourState }} name="trash-o" size={20} />
              </View>
              <View style={styles.moreModalButtonText_box}>
                <Text style={styles.moreModalButtonText}>{'Delete'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};
export default PdfView;

const styles = StyleSheet.create({
  viewAllPage: {
    backgroundColor: '#ffffffff',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  viewAllTopBar: {
    width: '100%',
    flexShrink: 1,
    backgroundColor: '#c4c4c4ff',
    elevation: 2,
    shadowColor: '#000000',
    shadowRadius: 2.621621621621622,
    shadowOpacity: 0.2173913043478261,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignItems: 'center',
    flexDirection: 'row',
    top: 0,
    zIndex: 999,
    //minHeight: 88,
  },
  big_title: {
    color: '#344053ff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 28,
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'System' /* Jaldi */,
  },
  big_title_box: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 15,
    flexGrow: 1,
    minHeight: 28,
  },
  pdfTextContainer: {
    height: '70%',
    padding: 15,
    overflow: 'scroll',
  },
  pdfText: {
    color: '#344053ff',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 20,
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'System' /* Inter */,
    paddingHorizontal: 0,
  },
  viewAllBottomBar: {
    width: '100%',
    flexDirection: 'row',
    flexShrink: 1,
    backgroundColor: '#c4c4c4ff',
    //shadowColor: 'transparent' /* cannot find mapping from CSS: 0px -4px 4px 0px rgba(0,0,0,0.09803921568627451), https://ethercreative.github.io/react-native-shadow-generator/ */
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#d0d5ddff',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowRadius: 2.621621621621622,
    shadowOpacity: 0.2173913043478261,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0,
  },
  backButton: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  moreButton: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreModalInner: {
    width: '45%',
    flexShrink: 1,
    backgroundColor: '#f5f5f5ff',
    borderRadius: 7,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#667084ff',
    opacity: 1,
  },
  moreModalButton: {
    flexGrow: 1,
    height: '8%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  moreModalButtonContent: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    //padding: 5
  },
  iconContainer: {
    width: '40%',
    height: '100%',
    alignItems: 'center',
  },
  moreModalButtonText: {
    color: '#344053ff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 20,
    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'System' /* Inter */,
  },
  moreModalButtonText_box: {
    flexShrink: 1,
  },
  moreModalButtonDivider: {
    backgroundColor: '#d0d5ddff',
    height: 1,
    width: '87%',
    alignSelf: 'center',
  },
  modalBottomBar: {
    width: '100%',
    height: '13%',
    flexDirection: 'row',
    //flexShrink: 1,
    justifyContent: 'center',
    //alignSelf: 'flex-end'
  },
});
