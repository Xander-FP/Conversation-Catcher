import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { selectColour } from 'apps/client/src/app/slices/user.slice';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { toggleDown } from 'apps/client/src/app/slices/member.slice';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
//import FileViewer from "react-native-file-viewer";

function DetermineTileCorner(props) {
  const colourState = useSelector(selectColour);
  const [checkboxState, setCheckboxState] = React.useState(false);
  const c = props.c;
  if (c) {
    return (
      <BouncyCheckbox
        size={20}
        fillColor={colourState}
        unfillColor="#FFFFFF"
        iconStyle={{ borderColor: colourState }}
        isChecked={checkboxState}
        onPress={() => setCheckboxState(!checkboxState)}
      />
    );
  }
  return null;
}

const memberthumbnailSource = {
  uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
  cache: true,
};

const MemberTile = ({
  id,
  name,
  date,
  thumbnailSource,
  text,
  showCheck,
  nav,
}) => {
  const colourState = useSelector(selectColour);
  const buildMember = () => {
    return { id: id, text: text , name: name , date: date }
  }
  return (
    <TouchableOpacity
      style={styles.memberTile}
      onPress={() =>
        nav.navigate('ViewPdfs', { id: { id }, text: { text }, name: { name } })
      }
    >
      <View style={[styles.thumbnail_containter, { borderColor: colourState }]}>
        <ImageBackground
          style={styles.memberThumbnail}
          //thumbnailSource={thumbnailSource}
        />
      </View>
      <View style={styles.memberTile_contents_not_thumbnail}>
        <View style={styles.memberTile_contents_not_thumbnail_inner}>
          <View style={styles.memberName_box}>
            <Text style={styles.memberName}>{name}</Text>
          </View>
          <View style={styles.memberDate_box}>
            <Text style={styles.memberDate}>{date}</Text>
          </View>
        </View>
        <View style={styles.corner_button}>
          <DetermineTileCorner c={showCheck} a={buildMember()}/>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MemberTile;

const styles = StyleSheet.create({
  memberTile: {
    flexGrow: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#c4c4c4ff',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#c4c4c4ff',
    shadowRadius: 5,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    flexDirection: 'row',
    margin: 5,
  },
  thumbnail_containter: {
    flex: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    aspectRatio: 1 / 1.4142,
  },
  memberThumbnail: {
    resizeMode: 'contain',
    borderRadius: 5,
  },
  memberTileInfo: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  memberTileInfo_item: {
    flexGrow: 0,
    flexShrink: 1,
  },
  memberTileText: {
    flexGrow: 1,
  },
  memberTileText_item: {
    flexGrow: 0,
    flexShrink: 1,
  },
  memberName: {
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
  memberName_box: {
    flexGrow: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    paddingTop: 15,
  },
  memberDate: {
    color: '#667084ff',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'normal',
    fontFamily: 'System' /* Inter */,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  memberDate_box: {
    flexGrow: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  corner_button: {
    padding: 10,
    flex: 1,
  },
  memberTile_contents_not_thumbnail: {
    flex: 4,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  memberTile_contents_not_thumbnail_inner: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 5,
    //flexGrow: 1, //flexgrow: 0
    marginRight: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 10,
    flex: 10,
  },
});
