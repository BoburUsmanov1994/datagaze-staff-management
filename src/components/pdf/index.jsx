import React from 'react';
import {Document, Page, StyleSheet, Font, View, Text, Image} from "@react-pdf/renderer";
import {get} from "lodash";

Font.register({
  family: "Roboto-B",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf"
});
const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    padding: '20 15 15 30',
    height: '300px',
    width: 800
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    border: '2px solid #000',
    padding: '10',
  },
  left: {
    width: '25%'
  },
  right: {
    width: '75%',
    flex: 1,
    flexDirection: 'column',
  },
  qrImage: {
    width: 80,
    height: 80
  },
  title: {
    fontSize: 18,
    fontWeight: 900,
    fontFamily: "Roboto-B",
  },
  text: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Roboto-B",
  },
  line: {
    marginBottom: 15
  }
});

const Pdf = ({data = {}}) => {
  const dataUrl = document.getElementById(get(data, 'id')).toDataURL();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.container}>
            <View style={styles.left}>
              <Image allowDangerousPaths src={dataUrl} style={styles.qrImage}/>
            </View>
            <View style={styles.right}>
              <View style={styles.line}>
                <Text style={styles.title}>Tashrif buyuruvchi</Text>
                <Text style={styles.text}>{get(data, 'employee.firstName')}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.title}>Javobgar shaxs</Text>
                <Text style={styles.text}>{get(data, 'responsiblePerson.firstName')}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.title}>Maqsad</Text>
                <Text style={styles.text}>{get(data, 'visitPurpose')}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Pdf;
