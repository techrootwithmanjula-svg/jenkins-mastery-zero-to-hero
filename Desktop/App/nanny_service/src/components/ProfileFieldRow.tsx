import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { spacing } from '../theme/tokens';

/** Props for ProfileFieldRow — a read-only label-value row with optional icon. */
export interface ProfileFieldRowProps {
    /** MaterialCommunityIcons name (optional). */
    icon?: string;
    /** Field label (e.g. "Name", "Age"). */
    label: string;
    /** Field value to display. Shows "—" if empty. */
    value: string;
    /** Optional testID for testing. */
    testID?: string;
}

/**
 * Reusable label-value row for profile view mode.
 * Displays an optional icon, a grey label, and a bold dark value with a divider.
 */
const ProfileFieldRow: React.FC<ProfileFieldRowProps> = ({ icon, label, value, testID }) => {
    const { theme } = useAppTheme();
    const displayValue = value?.trim() ? value : '—';

    return (
        <View
            testID={testID}
            accessible={true}
            accessibilityLabel={`${label}: ${value?.trim() ? value : 'not set'}`}
        >
            <View style={styles.row}>

                <View style={styles.textContainer}>
                    {icon && (
                        <MaterialCommunityIcons
                            name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
                            size={20}
                            color={theme.colors.outline}
                            style={styles.icon}
                        />
                    )}
                    <Text variant="bodySmall" style={{ ...styles.label, color: theme.colors.outline }}>
                        {label}
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text
                        variant="bodyLarge"
                        style={{
                            color: displayValue === '—' ? theme.colors.outline : theme.colors.onSurface,
                            fontWeight: '600',
                            marginLeft: 4,
                            marginTop: 4,
                        }}
                    >
                        {displayValue}
                    </Text>
                </View>
            </View>
            <Divider style={{ backgroundColor: theme.colors.surfaceVariant }} />
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    icon: {
        marginRight: spacing.sm,
        marginTop: 2,
    },
    textContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    label: {
        marginTop: 4,
        fontSize: 16,
    }
});

export default ProfileFieldRow;
