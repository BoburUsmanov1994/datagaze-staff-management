import React from 'react';
import {Document, Page, StyleSheet, Font, View, Text, Image} from "@react-pdf/renderer";
import {get} from "lodash";
import dayjs from "dayjs";

Font.register({
  family: "Roboto-B",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf"
});
Font.register({
  family: "Roboto-R",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf"
});
Font.register({
  family: "Roboto-I",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf"
});
const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    padding: '20 15 15 30',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    border: '2px solid #000',
    padding: '10',
  },
  left: {
    width: '20%'
  },
  right: {
    width: '80%',
    flex: 1,
    flexDirection: 'row'
  },
  qrImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 14,
    fontFamily: "Roboto-B",
  },
  text: {
    fontSize: 12,
    fontFamily: "Roboto-R",
  },
  line: {
    marginBottom: 5
  },
  flexLeft: {
    width: '50%',
    flex: 1,
    flexDirection: 'column',
  },
  flexRight: {
    width: '50%',
    flex: 1,
    flexDirection: 'column',
  }
});

const Pdf = ({data = {}}) => {
  const dataUrl = document.getElementById(get(data, 'id')).toDataURL('image/jpg', 1);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.container}>
            <View style={styles.left}>
              <Image src={dataUrl} style={styles.qrImage}/>
            </View>
            <View style={styles.right}>
              <View style={styles.flexLeft}>
                <View style={styles.line}>
                  <Text style={styles.title}>Tashrif buyuruvchi</Text>
                  <Text style={styles.text}>{get(data, 'employee.firstName', '-')}</Text>
                </View>
                <View style={styles.line}>
                  <Text style={styles.title}>Javobgar shaxs</Text>
                  <Text style={styles.text}>{get(data, 'responsiblePerson.firstName', '-')}</Text>
                </View>
                <View style={styles.line}>
                  <Text style={styles.title}>Maqsad</Text>
                  <Text style={styles.text}>{get(data, 'visitPurpose')}</Text>
                </View>
              </View>
              <View style={styles.flexRight}>
                <View style={styles.line}>
                  <Text style={styles.title}>Amal qilish muddati</Text>
                  <Text style={styles.text}>{dayjs(get(data, 'createdAt', '-')).format('DD-MM-YYYY')}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Pdf;
