import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Text, ScrollView, StyleSheet, DeviceEventEmitter } from 'react-native';
import Loading from '../loading/loading';
// import LocalPdfsAccess from '../local-pdfs-access/local-pdfs-access';
import PdfTile from '../pdf-tile/pdf-tile';
import pdfLocalAccess from '../local-pdfs-access/local-pdfs-access';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { selectEmail } from 'apps/client/src/app/slices/user.slice';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { selectPDFS, refillPDFs } from 'apps/client/src/app/slices/pdf.slice';
import { useSelector, useDispatch } from 'react-redux';

export function PdfDisplay({ navigation, selectMode }, ref) {
  // const [selectMode, setSelectMode] = useState(false);
  const [didReload, setDidReload] = useState(true);
  const emailState = useSelector(selectEmail);
  const localPDFs = useSelector(selectPDFS);
  const dispatch = useDispatch();
  //Expose refresh function to parent(View-all page)
  // useImperativeHandle(ref, () => ({
  //   refreshPfds: () => {
  //     // console.log('refreshing');
  //     setDidReload(!didReload);
  //   },
  // }));

  //Listen to when to update page
  DeviceEventEmitter.addListener('updatePage', () => setDidReload(!didReload));
  //graphql syntax trees
  const SET_USER = gql`
    mutation setUser(
      $oldEmail: String!
      $email: String!
      $colour: String!
      $pdfs: [String!]!
    ) {
      setUser(oldEmail: $oldEmail, email: $email, colour: $colour, pdfs: $pdfs)
    }
  `;

  const GET_USER_PDFS = gql`
    query getForUser($email: String!) {
      getPDFs(id: $email) {
        id
        name
        creationDate
        downloaded
        #pdf
        text
      }
    }
  `;

  const [setUser] = useMutation(SET_USER);
  const { data, loading, error } = useQuery(GET_USER_PDFS, {
    variables: { email: emailState },
  });
  // console.log('GetPdfs');
  // console.log(data);
  // console.log(loading);
  // console.log(error);
  if (loading)
    return (
      <ScrollView style={styles.recentPdfTiles}>
        {localPDFs.map((item, key) => (
          <PdfTile
            key={key}
            id={item.id}
            name={item.name}
            date={item.creationDate}
            source={''}
            text={item.text}
            downloaded={item.downloaded}
            showCheck={selectMode}
            pdfSource={'pdfRefresh'}
            nav={navigation}
            refresh={setDidReload}
          />
        ))}
        {/*<Loading >*/}
      </ScrollView>
    );

  if (error)
    return (
      <ScrollView style={styles.recentPdfTiles}>
        <Text>An error occured...</Text>
        <Text>{error[0]}</Text>
      </ScrollView>
    );
  //If the pdf array is empty assign the result from the query
  //create deep copy of the returned data
  //Data is here in data if returned
  if (!pdfLocalAccess.isLoaded()) {
    console.log('Loading from query');
    pdfLocalAccess.clearPdfs();
    for (let i = 0; i < data.getPDFs.length; i++) {
      pdfLocalAccess.addPdf({
        name: data.getPDFs[i].name,
        creationDate: data.getPDFs[i].creationDate,
        downloaded: data.getPDFs[i].downloaded,
        text: data.getPDFs[i].text,
        id: data.getPDFs[i].id,
        summarised: data.getPDFs[i].summarised,
        embeddings: data.getPDFs[i].embeddings,
      });
    }
    //Update the user pdfs array to ensure that deleted pdfs are removed
    setUser({
      variables: {
        oldEmail: emailState,
        email: emailState,
        colour: '',
        pdfs: pdfLocalAccess.getPdfIds(),
      },
    }).catch((e) => {
      console.log('error in delete of pdf in pdf array');
      console.log(e);
    });

    //Update local pdf storage
    //array of pdfs stored locally, selected from data to overwrite the slice
    if (data.getPDFs[0] !== undefined && data.getPDFs[0].name !== 'error') {
      let tempArray = [];
      var p;
      for (p in pdfLocalAccess.getPdfs()) {
        if (data.getPDFs[p].downloaded === true) {
          tempArray.push(data.getPDFs[p]);
        }
      }
      dispatch(refillPDFs(tempArray));
    }
  }

  return (
    <ScrollView style={styles.recentPdfTiles}>
      {pdfLocalAccess.getPdfs().map((item, key) => (
        <PdfTile
          key={key}
          id={item.id}
          name={item.name}
          date={item.creationDate}
          source={''}
          text={item.text}
          downloaded={item.downloaded}
          showCheck={selectMode}
          pdfSource={'pdfRefresh'}
          nav={navigation}
          // refresh={setDidReload}
        />
      ))}
    </ScrollView>
  );
}
export default forwardRef(PdfDisplay);

const styles = StyleSheet.create({
  recentPdfTiles: {
    height: '70%',
    paddingLeft: 15,
    paddingRight: 15,
    overflow: 'visible',
  },
});
