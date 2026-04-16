import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NewsData } from '../utils/handle-api';

interface NewsProps {
  news: NewsData;
  onPress: (id: string) => void;
}

export default function News({ news, onPress }: NewsProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(news.id)}
    >
      {news.image ? (
        imageError ? (
          <View style={styles.fallbackImage}>
            <Text style={styles.fallbackText}>Sem imagem</Text>
          </View>
        ) : (
          <Image
            source={{ uri: news.image }}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        )
      ) : null}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>
        {news.summary ? (
          <Text style={styles.summary} numberOfLines={2}>
            {news.summary}
          </Text>
        ) : null}
        <Text style={styles.date}>{news.published}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1a1a2e',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  summary: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  fallbackImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
