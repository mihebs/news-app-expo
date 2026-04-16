import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { NewsData } from '../utils/handle-api';

interface NewsDetailProps {
  news: NewsData | null;
  onClose: () => void;
}

export default function NewsDetail({ news, onClose }: NewsDetailProps) {
  const [imageError, setImageError] = useState(false);

  if (!news) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {news.image && !imageError ? (
        <Image
          source={{ uri: news.image }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.fallbackImage}>
          <Text style={styles.fallbackText}>Sem imagem</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.date}>{news.published}</Text>
        {news.summary ? <Text style={styles.summary}>{news.summary}</Text> : null}

        <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL(news.link)}>
          <Text style={styles.linkButtonText}>Ler notícia completa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 220,
  },
  fallbackImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#333',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  summary: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 24,
  },
  linkButton: {
    backgroundColor: '#1a1a2e',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  closeButton: {
    backgroundColor: '#e0e0e0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
